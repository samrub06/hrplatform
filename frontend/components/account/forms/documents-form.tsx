"use client"

import { Button } from "@/components/common/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/common/form"
import { Download, FileText, Trash2, Upload } from "lucide-react"

import { useDocumentsForm } from "@/lib/hooks/useDocumentsForm"
import { UserData } from "@/lib/types"

interface DocumentsFormProps {
  userData: Pick<UserData, 'cv'>
}

export default function DocumentsForm({ userData }: DocumentsFormProps) {
  const {
    form,
    dragOver,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleInputChange,
    downloadCv,
    removeCv
  } = useDocumentsForm(userData)



  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents & CV</CardTitle>
        <CardDescription>Upload and manage your CV, cover letters, and portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">

        {/* Current CV Section */}
        {userData.cv && (
          <div className="p-4 border rounded-lg bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium">Current CV</p>
                  <p className="text-sm text-muted-foreground">CV is uploaded and available</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" size="sm" onClick={downloadCv}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={removeCv}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <FormField
          control={form.control}
          name="cv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload New CV</FormLabel>
              <FormControl>
                <div>
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                      ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('cv-upload')?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {field.value ? field.value.name : "Drop your CV here or click to browse"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                  
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Upload your latest CV or resume. Supported formats: PDF, DOC, DOCX
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

     
     

     

        {/* Note: File upload is handled automatically on selection */}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}