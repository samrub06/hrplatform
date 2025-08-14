"use client"
import { Button } from "@/components/common/button"
import { Confetti } from "@/components/common/confetti"
import type { FormValues } from "@/components/form-steps/multi-step-form"
import { motion } from "framer-motion"
import { CheckCircle2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
interface FormSuccessProps {
  data: FormValues
}

export function FormSuccess({ data }: FormSuccessProps) {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Confetti />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3,
        }}
        className="mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 p-3 shadow-lg"
      >
        <CheckCircle2Icon className="h-12 w-12 text-white" />
      </motion.div>

      <motion.h2
        className="mb-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Profile Submitted Successfully!
      </motion.h2>

      <motion.p
        className="mb-6 max-w-md text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Thank you, {data.first_name}! Your profile has been submitted successfully. We&apos;ll review your information and
        get back to you soon.
      </motion.p>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="rounded-lg  border-blue-200 p-4 text-left shadow-md">
          <h3 className="mb-2 font-medium text-blue-700">Profile Summary</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="font-medium text-blue-600">Name:</span> {data.first_name} {data.last_name}
            </li>
            <li>
              <span className="font-medium text-blue-600">Email:</span> {data.email}
            </li>
            <li>
              <span className="font-medium text-blue-600">Role:</span> {data.role === "candidate" ? "Candidate" : "Publisher"}
            </li>
            {data.role === "candidate" && (
              <li>
                <span className="font-medium text-blue-600">Desired Position:</span> {data.desired_position || "Not specified"}
              </li>
            )}
            {data.role === "publisher" && (
              <>
                <li>
                  <span className="font-medium text-blue-600">Current Position:</span> {data.current_position || "Not specified"}
                </li>
                <li>
                  <span className="font-medium text-blue-600">Current Company:</span> {data.current_company || "Not specified"}
                </li>
              </>
            )}
            <li>
              <span className="font-medium text-blue-600">Skills:</span> {data.skills?.length || 0} skills added
            </li>
            <li>
              <span className="font-medium text-blue-600">Education:</span> {data.education?.length || 0} entries added
            </li>
          </ul>
        </div>

        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Button 
            variant="outline" 
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search)
              searchParams.set('step', '1')
              router.push(`?${searchParams.toString()}`)
            }}
            className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
          >
            Start Over
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            onClick={() => router.push('/dashboard')}
          >
            View Profile
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
