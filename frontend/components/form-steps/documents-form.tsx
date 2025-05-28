"use client"

import type React from "react"

import { useState } from "react"
import type { FormValues } from "@/components/multi-step-form"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"

export function DocumentsForm() {
  const { control } = useFormContext<FormValues>()
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File) => void) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
      setFileName(file.name)
    }
  }

  const handleRemoveFile = (onChange: (value: null) => void) => {
    onChange(null)
    setFileName(null)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Upload your CV</h2>
        <p className="text-muted-foreground">We'll use this to extract your skills and experience</p>
      </div>

      <FormField
        control={control}
        name="cv"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormControl>
              <div className="flex flex-col items-center">
                {!fileName ? (
                  <div className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-primary/50 bg-muted/50 p-12 text-center">
                    <UploadCloudIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                    <div className="mb-2 text-lg font-medium">Drop your CV here or click to upload</div>
                    <p className="mb-4 text-sm text-muted-foreground">Support for PDF, DOCX, DOC (Max 5MB)</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("cv-upload")?.click()}
                    >
                      Select File
                    </Button>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, onChange)}
                      {...field}
                    />
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-between rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {value instanceof File ? `${(value.size / 1024 / 1024).toFixed(2)} MB` : ""}
                        </p>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile(onChange)}>
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          We'll extract information from your CV to help you fill out the rest of the form. You can always edit the
          information later.
        </p>
      </div>
    </div>
  )
}
