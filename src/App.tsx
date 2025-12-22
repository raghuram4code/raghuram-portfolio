import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RefreshCcw, Code, Zap, Cpu, Mail, Download, Linkedin, Github, Users, TrendingUp, Briefcase, ChevronDown, CheckCircle, Send, Menu, X, Rocket, Database, Cloud, Shield, Settings, Activity, Layers, Terminal } from 'lucide-react';

// --- Data Definitions ---

const PERSONAL_DATA = {
    name: "Raghuram (R Rama Krishna Pedapati)",
    role: "Senior Test Automation Analyst",
    tagline: "Driving 95%+ Automation Coverage through AI, Cloud, and Modern Frameworks.",
    summary: "A seasoned automation specialist with over 15 years of experience in Quality Assurance, focusing on building scalable, maintainable, and highly efficient test automation frameworks. I leverage expertise in Java, Playwright, and Azure DevOps to transform QA processes from manual reliance to AI-driven, continuous verification, delivering exceptional product quality and speed to market.",
    github: "https://github.com/raghuram-rkp",
    linkedin: "https://www.linkedin.com/in/raghuram-rkp/",
    email: "rama.pedapati@gmail.com",
    cvLink: "/RamaKrishnaPedapati-Resume.pdf", // Placeholder for CV download
    profileImage: "https://placehold.co/150x150/4f46e5/ffffff?text=RP", // Placeholder
    yearsOfExperience: 15,
    projectsCount: 7,
    coverageAchieved: "95%+"
};

const SKILLS_DATA = [
    { name: "Playwright/Selenium", icon: <Code className="h-6 w-6 text-indigo-500" /> },
    { name: "Java/C#/.NET", icon: <Zap className="h-6 w-6 text-indigo-500" /> },
    { name: "AI/ML for QA", icon: <Cpu className="h-6 w-6 text-indigo-500" /> },
    { name: "Azure DevOps/CI/CD", icon: <Cloud className="h-6 w-6 text-indigo-500" /> },
    { name: "TestNG/JUnit/Rest Assured", icon: <Database className="h-6 w-6 text-indigo-500" /> },
    { name: "Performance/Security Testing", icon: <Shield className="h-6 w-6 text-indigo-500" /> },
    { name: "Agile/Scrum", icon: <Users className="h-6 w-6 text-indigo-500" /> },
    { name: "Framework Design", icon: <Layers className="h-6 w-6 text-indigo-500" /> },
    { name: "SQL/NoSQL", icon: <Terminal className="h-6 w-6 text-indigo-500" /> },
];

const PROJECTS_DATA = [
    {
        title: "AI-Powered Visual Regression Framework",
        description: "Developed a Playwright-based framework integrated with AI models for visual diffing and self-healing tests, reducing false positives by 40%.",
        technologies: ["Playwright", "Python (AI backend)", "Docker", "Azure Pipelines"],
        link: "#"
    },
    {
        title: "Bespoke Performance Benchmarking Tool",
        description: "Created a custom Java and Rest Assured solution to simulate high-load scenarios for core APIs, identifying and resolving 5 critical bottlenecks.",
        technologies: ["Java", "Rest Assured", "JMeter", "Grafana"],
        link: "#"
    },
    {
        title: "Unified Mobile & Web Automation Suite",
        description: "Engineered a single-codebase framework using Appium and Selenium to cover native mobile, hybrid, and web applications, boosting test efficiency.",
        technologies: ["Appium", "Selenium", "C# (.NET)", "MSTest"],
        link: "#"
    },
];

const EXPERIENCE_DATA = [
    {
        role: "Senior Test Automation Analyst",
        company: "Global Tech Solutions (Current)",
        duration: "2018 - Present",
        points: [
            "Architected and led the implementation of a scalable, cloud-native automation platform (Azure DevOps), achieving over 95% functional test coverage.",
            "Mentored a team of 10 QA engineers on Playwright best practices and CI/CD integration, resulting in a 30% reduction in regression cycle time.",
            "Introduced data-driven testing and parameterization techniques that standardized test creation across 5 major product lines.",
        ],
    },
    {
        role: "Automation Engineer",
        company: "Financial Services Corp",
        duration: "2014 - 2018",
        points: [
            "Developed and maintained a robust Selenium/Java framework for the core banking platform, covering critical user journeys.",
            "Led the migration of testing assets from a legacy tool to a modern open-source framework, saving the company $50k annually in licensing fees.",
            "Collaborated closely with development teams to implement Shift-Left testing principles, integrating tests directly into pull request checks.",
        ],
    },
];

const ACHIEVEMENTS_DATA = [
    {
        title: "Automation Coverage Leader",
        description: "Consistently delivered automation solutions that maintained functional test coverage above the 90% target for five consecutive years.",
        icon: <TrendingUp className="h-6 w-6 text-white" />,
    },
    {
        title: "CI/CD Pioneer Award",
        description: "Recognized for driving the adoption of GitOps and Azure Pipelines for all QA environments, ensuring zero-touch deployments.",
        icon: <Rocket className="h-6 w-6 text-white" />,
    },
    {
        title: "Mentorship Excellence",
        description: "Successfully onboarded and trained junior engineers, building a self-sufficient and skilled automation practice within the department.",
        icon: <Briefcase className="h-6 w-6 text-white" />,
    },
];

// --- Utility Components ---

const SectionTitle = ({ children, id, icon: Icon }) => (
    <div id={id} className="pt-20 -mt-20"> {/* Anchor point */}
        <h2 className="text-3xl font-bold text-gray-900 flex items-center mb-6">
            {Icon && <Icon className="h-6 w-6 text-indigo-600 mr-3" />}
            {children}
        </h2>
        <div className="w-16 h-1 bg-indigo-600 rounded mb-10"></div>
    </div>
);

const Button = ({ children, primary = false, link, onClick, className = '', external = true, as = 'a' }) => {
    const Component = as;
    const commonProps = {
        className: `flex items-center justify-center space-x-2 font-medium transition duration-300 rounded-lg shadow-md ${className}
            ${primary
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 hover:border-indigo-500'
        }`,
    };

    if (link) {
        return (
            <Component
                href={link}
                {...commonProps}
                target={external ? "_blank" : "_self"}
                rel={external ? "noopener noreferrer" : undefined}
            >
                {children}
            </Component>
        );
    }

    return (
        <button onClick={onClick} {...commonProps}>
            {children}
        </button>
    );
};

// --- LLM Powered Component (Skill Deep Dive) ---

const SkillCardWithLLM = ({ skill, index, experience, projects, name, role }) => {
    const [deepDive, setDeepDive] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const generateDeepDive = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setDeepDive('');

        // Construct context-rich prompt for the LLM
        const prompt = `Act as a senior technical ghostwriter for a Test Automation Analyst. Using the persona information below, write a short, two-paragraph explanation (max 120 words) detailing *how* this professional applies the skill "${skill.name}" in their job. Do not use generic filler. Focus on tools, frameworks, and measurable impact (e.g., coverage, reduction in cycle time).

        Persona Role: ${role}
        Persona Projects: ${projects.map(p => p.title).join('; ')}.
        Persona Experience Highlights: ${experience.map(e => e.role + " at " + e.company).join('; ')}.
        
        Start directly with the explanation.`;

        // IMPORTANT: You must replace "" with your actual Gemini API Key to use this feature.
        const apiKey = "AIzaSyAEe7ONIvd7985SlH9eAqbkMaT-xB_l_tY";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        systemInstruction: { parts: [{ text: "You are a professional technical writer specializing in QA and software automation portfolios. Your output must be concise and professional." }] }
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate deep dive. Please try again.";
                setDeepDive(text);
                break; // Exit loop on success

            } catch (error) {
                console.error(`Gemini API Error (Attempt ${retries + 1}):`, error);
                retries++;
                if (retries < maxRetries) {
                    // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
                } else {
                    setDeepDive("Error generating deep dive. Failed to connect to the AI model. Check your API key and console for details.");
                }
            }
        }
        setIsLoading(false);
    };

    return (
        <motion.div
            key={skill.name}
            className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.5 }}
        >
            <div className="p-3 mb-4 bg-indigo-100 rounded-full">
                {skill.icon}
            </div>
            <p className="text-lg font-semibold text-gray-800">{skill.name}</p>

            <button
                onClick={deepDive ? () => setDeepDive('') : generateDeepDive}
                className={`mt-4 flex items-center justify-center text-sm px-3 py-1 rounded-full font-medium transition-colors ${isLoading ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : (deepDive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-600 text-white hover:bg-indigo-500')}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Generating...
                    </>
                ) : deepDive ? (
                    <>
                        <X className="h-4 w-4 mr-1" /> Hide Dive
                    </>
                ) : (
                    <>
                        ✨ Deep Dive
                    </>
                )}
            </button>

            {deepDive && (
                <motion.div
                    className="mt-4 p-4 text-left w-full bg-indigo-50 border-l-4 border-indigo-600 rounded-lg text-gray-700 text-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h4 className="font-bold text-indigo-800 mb-1">Application of {skill.name}:</h4>
                    <p>{deepDive}</p>
                </motion.div>
            )}
        </motion.div>
    );
};

// --- Section Components ---

const HeroSection = () => (
    <motion.section
        id="hero"
        className="pt-32 pb-20 bg-gray-50 dark:bg-gray-900 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
                <div className="lg:w-1/2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                        {PERSONAL_DATA.role}
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                        {PERSONAL_DATA.name}
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 mb-8">
                        {PERSONAL_DATA.tagline}
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button primary link="#contact" className="py-3 px-6 text-lg">
                            <Mail className="h-5 w-5" /> Get In Touch
                        </Button>
                        <Button link={PERSONAL_DATA.cvLink} external={false} className="py-3 px-6 text-lg">
                            <Download className="h-5 w-5" /> Download CV
                        </Button>
                    </div>
                </div>

                <motion.div
                    className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className="relative p-4 bg-white rounded-xl shadow-2xl">
                        <img
                            src={PERSONAL_DATA.profileImage}
                            alt={PERSONAL_DATA.name}
                            className="w-56 h-56 rounded-full object-cover ring-4 ring-indigo-500/50"
                        />
                        <motion.div
                            className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg transform translate-x-1 translate-y-1"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        >
                            <RefreshCcw className="h-6 w-6" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    </motion.section>
);

const AboutSection = () => (
    <motion.section
        id="about"
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Users}>About Me</SectionTitle>
            <div className="text-lg text-gray-700 leading-relaxed space-y-6">
                <p>
                    {PERSONAL_DATA.summary}
                </p>
                <div className="flex flex-wrap gap-8 justify-center sm:justify-start pt-4">
                    <div className="text-center p-4 bg-indigo-50 rounded-xl shadow-md">
                        <p className="text-4xl font-extrabold text-indigo-600">{PERSONAL_DATA.yearsOfExperience}+</p>
                        <p className="text-gray-600">Years Experience</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-xl shadow-md">
                        <p className="text-4xl font-extrabold text-indigo-600">{PERSONAL_DATA.projectsCount}+</p>
                        <p className="text-gray-600">Major Projects</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-xl shadow-md">
                        <p className="text-4xl font-extrabold text-indigo-600">{PERSONAL_DATA.coverageAchieved}</p>
                        <p className="text-gray-600">Automation Coverage</p>
                    </div>
                </div>
            </div>
        </div>
    </motion.section>
);

const SkillsSection = () => (
    <motion.section
        id="skills"
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Settings}>Core Skills & Expertise</SectionTitle>
            <p className="text-center text-gray-600 mb-8">Click the **"✨ Deep Dive"** button on any skill card to see a personalized explanation of its application, generated by the Gemini AI.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {SKILLS_DATA.map((skill, index) => (
                    <SkillCardWithLLM
                        key={skill.name}
                        skill={skill}
                        index={index}
                        experience={EXPERIENCE_DATA}
                        projects={PROJECTS_DATA}
                        name={PERSONAL_DATA.name}
                        role={PERSONAL_DATA.role}
                    />
                ))}
            </div>
        </div>
    </motion.section>
);

const ProjectCard = ({ project, index }) => (
    <motion.div
        className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
    >
        <div className="p-6 flex-grow">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
        <div className="p-6 pt-0">
            <Button link={project.link} className="w-full py-2 text-base">
                View Project (Mock Link) <Github className="h-4 w-4 ml-2" />
            </Button>
        </div>
    </motion.div>
);

const ProjectsSection = () => (
    <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Activity}>Key Automation Projects</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PROJECTS_DATA.map((project, index) => (
                    <ProjectCard key={index} project={project} index={index} />
                ))}
            </div>
        </div>
    </section>
);

const ExperienceItem = ({ experience, index }) => (
    <motion.div
        className="relative pb-8 sm:pb-12 border-l-4 border-indigo-200 ml-2"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
    >
        <span className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-indigo-600 shadow-lg ring-4 ring-white"></span>
        <div className="ml-8 p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900">{experience.role}</h3>
            <p className="text-indigo-600 font-medium mb-2">{experience.company}</p>
            <p className="text-sm text-gray-500 mb-4">{experience.duration}</p>
            <ul className="list-disc space-y-2 text-gray-700 pl-5">
                {experience.points.map((point, i) => (
                    <li key={i}>{point}</li>
                ))}
            </ul>
        </div>
    </motion.div>
);

const ExperienceSection = () => (
    <section id="experience" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Briefcase}>Professional Experience</SectionTitle>
            <div className="relative">
                {EXPERIENCE_DATA.map((exp, index) => (
                    <ExperienceItem key={index} experience={exp} index={index} />
                ))}
            </div>
        </div>
    </section>
);

const AchievementsSection = () => (
    <section id="achievements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={CheckCircle}>Career Highlights</SectionTitle>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                {ACHIEVEMENTS_DATA.map((achievement, index) => (
                    <motion.div
                        key={index}
                        className="p-6 bg-gray-900 rounded-xl shadow-2xl"
                        initial={{ opacity: 0, rotateX: 90 }}
                        whileInView={{ opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.15 }}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <div className="p-4 inline-block mb-4 bg-indigo-600 rounded-full">
                            {achievement.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                        <p className="text-gray-300">{achievement.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const ContactSection = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('');

    // Mock submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('');

        // Simulate API call delay
        setTimeout(() => {
            console.log("Contact form submitted:", { name, email, message });
            if (name && email && message) {
                setStatus('success');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setStatus('error');
            }
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle icon={Mail}>Let's Connect</SectionTitle>
                <div className="lg:flex lg:space-x-12">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <p className="text-lg text-gray-700 mb-6">
                            I'm always open to discussing new automation challenges, framework design, or collaboration opportunities. Feel free to reach out directly or connect with me on social media.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-700">
                                <Mail className="h-6 w-6 text-indigo-600" />
                                <span className="font-medium">{PERSONAL_DATA.email} </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700">
                                <Linkedin className="h-6 w-6 text-indigo-600" />
                                <a href={PERSONAL_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">LinkedIn Profile</a>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700">
                                <Github className="h-6 w-6 text-indigo-600" />
                                <a href={PERSONAL_DATA.github} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">GitHub Repositories</a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl space-y-6">
                            <h4 className="text-2xl font-bold text-gray-900">Send a Message</h4>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                ></textarea>
                            </div>
                            <Button primary as="button" className="w-full py-3 text-lg" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <RefreshCcw className="h-5 w-5 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" /> Send Message
                                    </>
                                )}
                            </Button>
                            {status === 'success' && (
                                <p className="text-green-600 font-medium mt-2 p-3 bg-green-50 rounded-lg">Thank you! Your message has been sent successfully (Mock Submission).</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-600 font-medium mt-2 p-3 bg-red-50 rounded-lg">Please fill out all fields before submitting.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};


const Footer = () => (
    <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4">
                <a href={PERSONAL_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="mx-3 hover:text-indigo-400 transition-colors">
                    <Linkedin className="h-6 w-6 inline-block" />
                </a>
                <a href={PERSONAL_DATA.github} target="_blank" rel="noopener noreferrer" className="mx-3 hover:text-indigo-400 transition-colors">
                    <Github className="h-6 w-6 inline-block" />
                </a>
                <a href={`mailto:${PERSONAL_DATA.email}`} className="mx-3 hover:text-indigo-400 transition-colors">
                    <Mail className="h-6 w-6 inline-block" />
                </a>
            </div>
            <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} {PERSONAL_DATA.name}. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-2">
                Built with React and Tailwind CSS.
            </p>
        </div>
    </footer>
);

// --- Main App Component ---

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const controls = useAnimation();

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const handleScroll = useCallback(() => {
        const scrolled = window.scrollY > 50;
        setIsScrolled(scrolled);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Clean up event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Animation for header based on scroll
    useEffect(() => {
        if (isScrolled) {
            controls.start({
                y: 0,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
            });
        } else {
            controls.start({
                y: 0, // Keep Y at 0, only change shadow
                boxShadow: "none"
            });
        }
    }, [isScrolled, controls]);

    const navLinks = useMemo(() => [
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Experience", href: "#experience" },
        { name: "Achievements", href: "#achievements" },
        { name: "Contact", href: "#contact" },
    ], []);

    return (
        <div className="min-h-screen bg-white font-inter text-gray-900">
            {/* Header / Navigation */}
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-transparent'}`}
                initial={{ y: 0 }}
                animate={controls}
                transition={{ duration: 0.3 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    <a href="#hero" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-500 transition-colors">
                        R. Pedapati
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex space-x-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors p-2"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    <Button
                        primary
                        link={PERSONAL_DATA.linkedin}
                        className="py-2 px-4 text-sm hidden sm:block"
                    >
                        <Linkedin className="h-4 w-4" /> View LinkedIn
                    </Button>
                </div>

                {/* Mobile Menu */}
                <motion.nav
                    initial={false}
                    animate={isMenuOpen ? "open" : "closed"}
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        closed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                    className={`lg:hidden overflow-hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg border-t border-gray-100`}
                >
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={toggleMenu} // Close menu on click
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <Button
                            primary
                            link={PERSONAL_DATA.linkedin}
                            className="w-full py-2 text-base mt-2"
                            onClick={toggleMenu}
                        >
                            <Linkedin className="h-5 w-5" /> View LinkedIn
                        </Button>
                    </div>
                </motion.nav>
            </motion.header>

            <main>
                <HeroSection />
                <AboutSection />
                <SkillsSection />
                <ProjectsSection />
                <ExperienceSection />
                <AchievementsSection />
                <ContactSection />
            </main>

            <Footer />

            {/* Scroll to Top Button */}
            <motion.button
                className="fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg z-50 hover:bg-indigo-500 transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                initial={{ opacity: 0, scale: 0 }}
                // Fix: Ensure the scroll to top button only appears when scrolled down
                animate={{ opacity: isScrolled ? 1 : 0, scale: isScrolled ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-label="Scroll to top"
            >
                <ChevronDown className="h-6 w-6 transform rotate-180" />
            </motion.button>
        </div>
    );
};

export default App;