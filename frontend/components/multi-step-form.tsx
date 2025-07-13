"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { DocumentsForm } from "@/components/form-steps/documents-form"
import { EducationForm } from "@/components/form-steps/education-form"
import { FormSuccess } from "@/components/form-steps/form-success"
import { LinksForm } from "@/components/form-steps/links-form"
import { PersonalInfoForm } from "@/components/form-steps/personal-info-form"
import { SkillsForm } from "@/components/form-steps/skills-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { ExtractedCVData, uploadFile, validateFile } from "@/lib/services/fileUpload"

// Define the form schema
export const formSchema = z.object({
  // Personal Info
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  profilePicture: z.any().optional(),
  role: z.enum(["candidate", "publisher"]),
  desired_position: z.string().optional(),
  salary_expectation: z.number().optional(),
  current_position: z.string().optional(),
  current_company: z.string().optional(),

  // Documents
  cv: z.any().optional(),

  // Skills
  skills: z
    .array(
      z.object({
        name: z.string().min(1, "Skill name is required"),
        years_of_experience: z.number().min(0),
      }),
    )
    .optional(),

  // Links
  phone_number: z.string().optional(),
  github_link: z.string().optional(),
  linkedin_link: z.string().optional(),

  // Education
  education: z
    .array(
      z.object({
        institution: z.string().min(1, "Institution is required"),
        degree: z.string().min(1, "Degree is required"),
        fieldOfStudy: z.string().optional(),
        period: z.array(z.date()).length(2).optional(),
        description: z.string().optional(),
      }),
    ),
})

export type FormValues = z.infer<typeof formSchema>

const STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "documents", label: "Documents" },
  { id: "skills", label: "Skills" },
  { id: "links", label: "Contact Links" },
  { id: "education", label: "Education" },
  { id: "complete", label: "Complete" },
]

const STEP_TITLES = [
  {
    title: "Personal Information",
    subtitle: "Start by entering your basic information."
  },
  {
    title: "Upload your CV",
    subtitle: "We'll use this to extract your skills and experience"
  },
  {
    title: "Skills",
    subtitle: "Indicate your main skills."
  },
  {
    title: "Contact Links",
    subtitle: "Add your professional links and contact methods."
  },
  {
    title: "Education",
    subtitle: "Describe your academic journey."
  },
]

export function MultiStepForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [direction, setDirection] = useState(0) // -1 for backward, 1 for forward
  const [uploadProgress, setUploadProgress] = useState(0)

  // Initialize currentStep from URL params on component mount
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10)
      if (!isNaN(stepNumber) && stepNumber >= 0 && stepNumber < STEPS.length) {
        setCurrentStep(stepNumber)
      }
    }
  }, [searchParams])

  // Update URL when currentStep changes
  const updateStepInURL = (step: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('step', step.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "candidate" as const,
      skills: [],
      education: [],
      phone_number: "",
      github_link: "",
      linkedin_link: "",
    },
  })

  const { handleSubmit, trigger, setValue } = form

  const progress = (currentStep / (STEPS.length - 1)) * 100

  // Get step data for API call
  const getStepData = (step: number): Partial<FormValues> => {
    const formData = form.getValues()
    
    switch (step) {
      case 0: // Personal Info
        return {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role: formData.role,
          desired_position: formData.desired_position,
          current_position: formData.current_position,
          current_company: formData.current_company,
        }
      case 1: // Documents
        return {
          cv: formData.cv
        }
      case 2: // Skills
        return {
          skills: formData.skills
        }
      case 3: // Links
        return {
          phone_number: formData.phone_number,
          github_link: formData.github_link,
          linkedin_link: formData.linkedin_link,
        }
      case 4: // Education
        return {
          education: formData.education
        }
      default:
        return {}
    }
  }

  // Populate form with extracted CV data
  const populateFormWithCVData = (extractedData: ExtractedCVData) => {
  
    // Populate skills
    if (extractedData.skills && extractedData.skills.length > 0) {
      const formattedSkills = extractedData.skills.map((skill: { name: string; yearsOfExperience: number }) => ({
        name: skill.name,
        years_of_experience: skill.yearsOfExperience
      }));
      setValue('skills', formattedSkills);
    }

    // Populate education
    if (extractedData.education && extractedData.education.length > 0) {
      const formattedEducation = extractedData.education.map((edu: { 
        institution: string; 
        degree: string; 
        fieldOfStudy: string; 
        startDate: string; 
        endDate?: string; 
        description?: string 
      }) => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy || '',
        period: edu.startDate && edu.endDate ? [new Date(edu.startDate), new Date(edu.endDate)] : undefined,
        description: edu.description || ''
      }));
      setValue('education', formattedEducation);
    }

    toast("CV data extracted", {
      description: "Your CV information has been automatically filled in.",
    });
  }

  // Handle file upload for documents step
  const handleFileUpload = async (file: File, fileKey: 'cv' | 'profilePicture') => {
    try {
      // Validate file
      const validationError = validateFile(file, 10)
      if (validationError) {
        toast("Validation Error", {
          description: validationError,
        })
        return false
      }

      setUploadProgress(0)
      
      // Upload file with progress tracking and CV extraction
      const result = await uploadFile({
        file,
        fileKey,
        onProgress: (progress: number) => {
          setUploadProgress(progress)
        }
      })

      if (result.success) {
        // Update form value
        setValue(fileKey, result.fileName)
        
        // Populate form with extracted CV data if available
        if (fileKey === 'cv' && result.extractedData) {
          populateFormWithCVData(result.extractedData);
        }
        
        toast("Upload successful", {
          description: `${file.name} has been uploaded successfully.`,
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('File upload error:', error)
      toast("Upload failed", {
        description: "Failed to upload file. Please try again.",
      })
      return false
    } finally {
      setUploadProgress(0)
    }
  }

  // Save step data to API
  const saveStepData = async (step: number, data: Partial<FormValues>) => {
    try {
      // Handle file upload for documents step
      if (step === 1 && data.cv instanceof File) {
        const uploadSuccess = await handleFileUpload(data.cv, 'cv')
        if (!uploadSuccess) {
          throw new Error('File upload failed')
        }
        // Remove file from data since it's already uploaded
        delete data.cv
      }

      // Handle profile picture upload for personal info step
      if (step === 0 && data.profilePicture instanceof File) {
        const uploadSuccess = await handleFileUpload(data.profilePicture, 'profilePicture')
        if (!uploadSuccess) {
          throw new Error('Profile picture upload failed')
        }
        // Remove file from data since it's already uploaded
        delete data.profilePicture
      }

      // Handle skills update specifically for CV skills
      if (step === 2 && data.skills) {
        // Update CV skills using the specific endpoint
        const skillsResponse = await fetch(`/api/cv/update-skills`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skills: data.skills.map(skill => ({
              name: skill.name,
              yearsOfExperience: skill.years_of_experience
            }))
          }),
        })

        if (!skillsResponse.ok) {
          throw new Error('Failed to update CV skills')
        }

        // Remove skills from data since they're handled separately
        delete data.skills
      }

      // Handle education update specifically for CV education
      if (step === 4 ) {
        // Update CV education using the specific endpoint
        const educationResponse = await fetch(`/api/cv/update-education`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            education: data.education?.map(edu => ({
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy || '',
              startDate: edu.period?.[0] || new Date(),
              endDate: edu.period?.[1] || undefined,
              description: edu.description || ''
            }))
          }),
        })

        if (!educationResponse.ok) {
          throw new Error('Failed to update CV education')
        }

        // Remove education from data since it's handled separately
        delete data.education
      }
      
      // API call to update user data (only if there's remaining data)
      if (Object.keys(data).length > 0) {
        const response = await fetch(`/api/user`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            onboarding_step: step + 1 // Update to next step
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save step data')
        }
      }

      toast("Step saved", {
        description: "Your progress has been saved successfully.",
      })

    } catch (error) {
      console.error('Error saving step data:', error)
      toast("Error", {
        description: "Failed to save your progress. Please try again.",
      })
      throw error
    }
  }

  const goToNextStep = async () => {
    // Validate the current step before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate as Array<keyof FormValues>)

    if (isValid) {
      try {
        setIsSubmitting(true)
        
        // Save current step data
        const stepData = getStepData(currentStep)
        await saveStepData(currentStep, stepData)

        if (currentStep < STEPS.length - 1) {
          setDirection(1)
          const nextStep = currentStep + 1
          setCurrentStep(nextStep)
          updateStepInURL(nextStep)
          window.scrollTo(0, 0)
        }
      } catch (error) {
        // Error already handled in saveStepData
        console.error('Error in goToNextStep:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      updateStepInURL(prevStep)
      window.scrollTo(0, 0)
    }
  }

  const getFieldsForStep = (step: number): Array<keyof FormValues> => {
    switch (step) {
      case 0: // Personal Info
        return ["first_name", "last_name", "email", "role", "desired_position", "current_position", "current_company"]
      case 1: // Documents
        return ["cv"]
      case 2: // Skills
        return ["skills"]
      case 3: // Links
        return ["phone_number", "github_link", "linkedin_link"]
      case 4: // Education
        return ["education"]
      default:
        return []
    }
  }

  const onSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Save final step data
      const stepData = getStepData(currentStep)
      await saveStepData(currentStep, stepData)

      await fetch(`/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        }),
      })

      // Mark form as completed in cache and clear it
      // markAsCompleted() // This line is removed as per the edit hint
      // clearCache() // This line is removed as per the edit hint

      // Move to success step
      setDirection(1)
      setCurrentStep(STEPS.length - 1)
      
      toast("Profile completed!", {
        description: "Your profile has been successfully created.",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast("Error", {
        description: "Failed to complete your profile. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={{
            enter: (direction) => ({
              x: direction > 0 ? 100 : -100,
              opacity: 0,
            }),
            center: {
              x: 0,
              opacity: 1,
            },
            exit: (direction) => ({
              x: direction > 0 ? -100 : 100,
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <FormProvider {...form}>
            {currentStep === 0 && (
              <PersonalInfoForm />
            )}
            {currentStep === 1 && (
              <DocumentsForm uploadProgress={uploadProgress} />
            )}
            {currentStep === 2 && (
              <SkillsForm />
            )}
            {currentStep === 3 && (
              <LinksForm />
            )}
            {currentStep === 4 && (
              <EducationForm />
            )}
            {currentStep === 5 && <FormSuccess data={form.getValues()} />}
          </FormProvider>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen md:min-h-[80vh] flex flex-col justify-start pt-0 md:pt-0"
    >
      {/* Header with gradient text like RoleSelectionForm */}
      {STEP_TITLES[currentStep]?.title && (
        <motion.div 
          className="w-full max-w-2xl mx-auto md:mt-16 mb-3 md:mb-5 duration-300 p-3 md:p-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
              {STEP_TITLES[currentStep].title}
            </h2>
            <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-base">
              {STEP_TITLES[currentStep].subtitle}
            </p>
          </div>
        </motion.div>
      )}

      {/* Progress bar with improved styling */}
      {currentStep < STEPS.length - 1 && (
        <motion.div
          className="space-y-2 w-full max-w-2xl mx-auto px-3 md:px-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm text-slate-700 font-medium">
            <span>
              Step {currentStep + 1} of {STEPS.length - 1}
            </span>
            <span>{STEPS[currentStep].label}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" />
        </motion.div>
      )}

      {/* Main form card with improved styling */}
      <motion.div
        className="w-full max-w-2xl mx-auto px-3 md:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300">
          <CardContent className="pt-6 px-6 md:px-10 pb-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent()}
              {currentStep < STEPS.length - 1 && (
                <motion.div
                  className="mt-8 flex justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 0 || isSubmitting}
                    className="hover:bg-slate-50 transition-all duration-200"
                  >
                    <ChevronLeftIcon className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  {currentStep === STEPS.length - 2 ? (
                    <Button
                      type="button"
                      onClick={async () => {
                        const isValid = await trigger()
                        if (isValid) {
                          onSubmit()
                        }
                      }}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-200"
                    >
                      {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                      Submit
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={goToNextStep}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-200"
                    >
                      {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                      Next
                      <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
