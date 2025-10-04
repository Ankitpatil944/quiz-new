import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar-menu";
import Footer from "@/components/Footer";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  TrendingUp, 
  BookOpen, 
  MessageCircle, 
  Calendar,
  Star,
  Award,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles
} from "lucide-react";

const Mentorship = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "1-on-1 Guidance",
      description: "Get personalized attention from industry experts who understand your career goals."
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Goal Setting",
      description: "Define clear career objectives and create actionable roadmaps to achieve them."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Skill Development",
      description: "Learn industry-relevant skills through hands-on projects and real-world applications."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Industry Insights",
      description: "Gain insider knowledge about your target industry and current market trends."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Regular Check-ins",
      description: "Stay on track with scheduled sessions and continuous feedback loops."
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule with our flexible mentoring system."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#031527]">
      <Navbar />
      <div className="relative w-full animate-fade-in">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative z-40 lg:min-h-screen max-w-screen-2xl mx-auto pt-16 bg-gradient-to-b from-cyan-100 to-white overflow-hidden"
        >
          <div className="relative max-w-7xl mx-auto pt-16 lg:pt-20">
        
        {/* Hero Section */}
        <section className="relative pt-20 mt-10 pb-20">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-primary/20 animate-fade-in">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Expert Guidance for Your Career</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight animate-fade-in text-[#2D3253]">
                Accelerate Your Career with
                <span className="bg-gradient-primary bg-clip-text text-transparent block">Expert Mentorship</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
                Connect with industry professionals from top Indian companies who have walked the path you want to take. 
                Get personalized guidance, industry insights, and the support you need to succeed in the Indian job market.
              </p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <Link to="/find-mentor">
                  <Button variant="default" size="lg" className="group hover-scale">
                    Find Your Mentor
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="hover-scale">
                  Become a Mentor
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16 animate-fade-in"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Why Choose Our 
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Mentorship Program?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive approach ensures you get the most out of your mentoring experience
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="p-8 bg-gradient-card border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow-accent group hover-scale animate-fade-in">
                    <div className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:animate-pulse">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
          </div>
        </motion.section>
      </div>

      {/* Footer Section */}
      <div
        className="-mt-16 relative z-10 min-h-screen max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8 border border-blue-300 rounded-tl-[70px] rounded-tr-[70px] overflow-hidden bg-[#FFFFFF] animate-fade-in"
      >
        {/* Footer */}
        <Footer />

        <div className="px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-[16rem] flex items-center justify-center tracking-widest">
            <TextHoverEffect text=" AInode " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
