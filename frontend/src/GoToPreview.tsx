import {useState, useEffect, FC} from 'react';
import { useSpring, animated } from 'react-spring';

const GoToPreview: FC = () => {
    const [scrollingDown, setScrollingDown] = useState(false);
    const [prevScroll, setPrevScroll] = useState(window.scrollY);
    const thresholdShow = 100;
    const thresholdHide = 0;

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const scrollDifference = Math.abs(currentScroll - prevScroll);

            if (currentScroll > prevScroll && scrollDifference >= thresholdShow) {
                setScrollingDown(true);
                setPrevScroll(currentScroll);
            } else if (currentScroll < prevScroll && scrollDifference >= thresholdHide) {
                setScrollingDown(false);
                setPrevScroll(currentScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScroll]);

    const animation = useSpring({
        transform: scrollingDown ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
        opacity: scrollingDown ? 1 : 0,
        config: { duration: 100 }
    });

    return (
        <animated.div style={animation} className="fixed bottom-10 left-0 right-0 flex justify-center">
            <button className="text-white shadow-custom w-40 h-12 flex justify-center rounded-3xl border-2 bg-green-400 border-black">
                Preview
            </button>
        </animated.div>
    );
};

export default GoToPreview;


