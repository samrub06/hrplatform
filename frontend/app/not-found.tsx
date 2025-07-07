import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white/70 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
            404
          </CardTitle>
          <p className="text-slate-600 text-lg">
            Page not found
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-slate-500">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Besoin d&apos;aide ? Contactez notre support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}