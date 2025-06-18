"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-react"
import { useState } from "react"
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

// Titres et sous-titres pour chaque étape
const STEP_TITLES = [
  {
    title: "Personal Information",
    subtitle: "Start by entering your basic information."
  },
  {
    title: "Documents",
    subtitle: "Add your CV and other relevant documents."
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
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [direction, setDirection] = useState(0) // -1 for backward, 1 for forward

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

  const { handleSubmit, trigger } = form

  const progress = (currentStep / (STEPS.length - 1)) * 100

  const goToNextStep = async () => {
    // Validate the current step before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate as Array<keyof FormValues>)

    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setDirection(1)
        setCurrentStep((prev) => prev + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
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

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      console.log("Form submitted with data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Move to success step
      setDirection(1)
      setCurrentStep(STEPS.length - 1)
    } catch (error) {
      console.error("Error submitting form:", error)
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
            {currentStep === 0 && <PersonalInfoForm />}
            {currentStep === 1 && <DocumentsForm />}
            {currentStep === 2 && <SkillsForm />}
            {currentStep === 3 && <LinksForm />}
            {currentStep === 4 && <EducationForm />}
            {currentStep === 5 && <FormSuccess data={form.getValues()} />}
          </FormProvider>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start  py-8 px-2">
      {/* Header dynamique */}
      {STEP_TITLES[currentStep]?.title && (
        <div className="w-full max-w-2xl mx-auto mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a202c] tracking-tight mb-2">
            {STEP_TITLES[currentStep].title}
          </h2>
        <p className="text-slate-500 mt-1 md:mt-2 text-base md:text-lg font-medium">
          {STEP_TITLES[currentStep].subtitle}
          </p>
        </div>
      )}
      {currentStep < STEPS.length - 1 && (
        <motion.div
          className="space-y-2 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-sm text-[#1a202c] font-medium">
            <span>
              Step {currentStep + 1} of {STEPS.length - 1}
            </span>
            <span>{STEPS[currentStep].label}</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#e2e8f0]" />
        </motion.div>
      )}

      <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white max-w-2xl w-full mt-6">
        <CardContent className="pt-1 px-6 md:px-10 pb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}
            {currentStep < STEPS.length - 1 && (
              <motion.div
                className="mt-8 flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0 || isSubmitting}
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
                        onSubmit(form.getValues())
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={isSubmitting}
                  >
                    Next
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
