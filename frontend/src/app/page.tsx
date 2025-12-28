import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, FileText } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="#">
                    <span className="font-bold text-xl">SchoolSansar</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
                        Pricing
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        About
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary text-white">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Manage Your School with Ease
                                </h1>
                                <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
                                    The all-in-one platform for administration, learning, and communication.
                                    Streamline operations and focus on education.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href="/get-started">
                                    <Button variant="secondary" className="hover:bg-secondary/90">
                                        Get Started
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-foreground">
                            Everything you need
                        </h2>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
                            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
                                <div className="p-3 bg-primary rounded-full text-primary-foreground">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Billing & Payments</h3>
                                <p className="text-muted-foreground">
                                    Automated fee collection, invoicing, and financial reporting.
                                    Integrated with Khalti.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
                                <div className="p-3 bg-primary rounded-full text-primary-foreground">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Student Management</h3>
                                <p className="text-muted-foreground">
                                    Track attendance, grades, and academic progress in one place.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-4 text-center p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
                                <div className="p-3 bg-primary rounded-full text-primary-foreground">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Exam Results</h3>
                                <p className="text-muted-foreground">
                                    Generate report cards and publish results instantly online.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background text-foreground">
                <p className="text-xs text-muted-foreground">
                    © 2024 SchoolSansar. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
