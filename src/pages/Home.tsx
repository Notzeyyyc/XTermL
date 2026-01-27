import SplitText from "@/components/SplitText"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

function Home() {
  const navigate = useNavigate()

  const handleLetterAnimationComplete = () => {
    // console.log("all letters have animated!");
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-4">
      <SplitText
        text="XTermL"
        className="text-2xl font-bold text-center"
        delay={50}
        duration={1.25}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={handleLetterAnimationComplete}
      />
      <motion.p 
        className="mt-4 text-zinc-500 text-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      >
        Let's build something amazing.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
      >
        <Button 
          onClick={() => navigate('/setup')}
          size="lg"
          className="bg-zinc-100 text-black hover:bg-white hover:scale-105 transition-all duration-300 font-semibold cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Open Setup Menu
        </Button>
      </motion.div>
    </div>
  )
}

export default Home
