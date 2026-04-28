import { motion } from "framer-motion";

function FadeIn({children, delay = 0, inView, className}) {
    if (inView) {
        return (

            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{once: true, margin: "-50px"}}
                transition={{ duration: 0.6, delay }}
                className={className}
            >
                {children}
            </motion.div>
        );
    }



    return (

        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay}}
            className={className}
        >
            {children}
        </motion.div>
    );
}


export default FadeIn;