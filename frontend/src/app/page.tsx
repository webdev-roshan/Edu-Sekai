import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, FileText, BookOpen, Calendar, CheckCircle, GraduationCap, Award, TrendingUp, Shield, Facebook, Twitter, Linkedin, Mail } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
                <Link className="flex items-center justify-center gap-2" href="#">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Edu Sekai</span>
                </Link>
                <nav className="ml-auto flex gap-6">
                    <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#features">Features</Link>
                    <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#how-it-works">How it Works</Link>
                    <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#testimonials">Testimonials</Link>
                    <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#pricing">Pricing</Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-200 bg-[size:40px_40px]"></div>
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="flex flex-col items-center space-y-6 text-center">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-slate-900">
                                    Transform Education Management
                                </h1>
                                <p className="mx-auto max-w-[700px] text-lg md:text-xl text-slate-600">
                                    Cloud-based multi-tenant platform for schools, colleges, and universities. Manage students, teachers, assignments, attendance, fees, and payments—all in one place.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/get-started">
                                    <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-transform">
                                        Start Free Trial
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                                        Watch Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-20 md:py-28 bg-white">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            Powerful Features for Modern Education
                        </h2>
                        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                            Everything you need to manage your institution efficiently and effectively
                        </p>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-start space-y-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    <Users className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Student & Teacher Management</h3>
                                <p className="text-slate-600">
                                    Comprehensive profiles, role-based access, and automated enrollment processes.
                                </p>
                            </div>
                            <div className="flex flex-col items-start space-y-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200">
                                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                    <FileText className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Assignments & Grading</h3>
                                <p className="text-slate-600">
                                    Create, distribute, and grade assignments with automated workflows and feedback.
                                </p>
                            </div>
                            <div className="flex flex-col items-start space-y-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200">
                                <div className="p-3 bg-teal-100 rounded-lg text-teal-600">
                                    <Calendar className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Attendance Tracking</h3>
                                <p className="text-slate-600">
                                    Real-time attendance monitoring with automated alerts and detailed reports.
                                </p>
                            </div>
                            <div className="flex flex-col items-start space-y-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200">
                                <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                                    <DollarSign className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Fee Management</h3>
                                <p className="text-slate-600">
                                    Automated billing, fee collection, invoice generation, and financial reporting.
                                </p>
                            </div>
                            <div className="flex flex-col items-start space-y-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200">
                                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Shield className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Secure Online Payments</h3>
                                <p className="text-slate-600">
                                    PCI-compliant payment processing with multiple gateway integrations.
                                </p>
                            </div>
                            <div className="flex flex-col items-start space-y-3 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200">
                                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Analytics & Reports</h3>
                                <p className="text-slate-600">
                                    Insights into academic performance, attendance trends, and financial health.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="w-full py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            How It Works
                        </h2>
                        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
                            Get started in minutes with our simple three-step process
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Sign Up</h3>
                                <p className="text-slate-600">
                                    Create your institution account in under 2 minutes. No credit card required.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Configure</h3>
                                <p className="text-slate-600">
                                    Set up your classes, add staff and students, and customize your workflow.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Launch</h3>
                                <p className="text-slate-600">
                                    Go live and start managing your institution with ease and efficiency.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="w-full py-20 md:py-28 bg-white">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            Trusted by Educators Worldwide
                        </h2>
                        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
                            See what institutions are saying about Edu Sekai
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Award key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-6 italic">
                                    "Edu Sekai transformed how we manage our school. The attendance and fee management features alone saved us countless hours every week."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                                    <div>
                                        <p className="font-bold text-slate-900">Dr. Sarah Johnson</p>
                                        <p className="text-sm text-slate-500">Principal, Lincoln High School</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Award key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-6 italic">
                                    "The multi-tenant architecture is perfect for our college network. We manage 5 campuses effortlessly from one platform."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600"></div>
                                    <div>
                                        <p className="font-bold text-slate-900">Prof. Michael Chen</p>
                                        <p className="text-sm text-slate-500">Dean, Metro University</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Award key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-6 italic">
                                    "Parents love the real-time updates and the secure payment system. Our collection efficiency improved by 40%!"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600"></div>
                                    <div>
                                        <p className="font-bold text-slate-900">Ms. Priya Sharma</p>
                                        <p className="text-sm text-slate-500">Administrator, Bright Future School</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="w-full py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
                            Choose the plan that fits your institution's needs
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all">
                                <h3 className="text-2xl font-bold mb-2 text-slate-900">Starter</h3>
                                <p className="text-slate-600 mb-6">Perfect for small schools</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-slate-900">$49</span>
                                    <span className="text-slate-600">/month</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">Up to 200 students</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">Basic features</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">Email support</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">5GB storage</span>
                                    </li>
                                </ul>
                                <Button className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200">Choose Plan</Button>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-8 rounded-xl shadow-2xl border-2 border-blue-600 transform scale-105 text-white">
                                <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold inline-block mb-4">Most Popular</div>
                                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                                <p className="text-blue-100 mb-6">For growing institutions</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">$149</span>
                                    <span className="text-blue-100">/month</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                        <span>Up to 1000 students</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                        <span>All features</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                        <span>Priority support</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                        <span>50GB storage</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                        <span>Custom branding</span>
                                    </li>
                                </ul>
                                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">Choose Plan</Button>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all">
                                <h3 className="text-2xl font-bold mb-2 text-slate-900">Enterprise</h3>
                                <p className="text-slate-600 mb-6">For large universities</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-slate-900">Custom</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">Unlimited students</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">All features</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">24/7 dedicated support</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">Unlimited storage</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-slate-700">Custom integrations</span>
                                    </li>
                                </ul>
                                <Button className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200">Contact Sales</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-20 md:py-28 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-3xl">
                                Ready to Transform Your Institution?
                            </h2>
                            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
                                Join thousands of schools, colleges, and universities already using Edu Sekai
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/get-started">
                                    <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-transform">
                                        Start Free 30-Day Trial
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="text-lg px-10 py-6 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent">
                                        Schedule a Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="h-8 w-8 text-blue-400" />
                                <span className="font-bold text-xl">Edu Sekai</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Transforming education management with cloud-based solutions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Connect</h4>
                            <div className="flex gap-4 mb-4">
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    <Facebook className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    <Twitter className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    <Linkedin className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="hover:text-blue-400 transition-colors">
                                    <Mail className="h-6 w-6" />
                                </Link>
                            </div>
                            <p className="text-sm text-slate-400">support@edusekai.com</p>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
                        <p>© 2024 Edu Sekai. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 sm:mt-0">
                            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}