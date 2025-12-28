import ClickSpark from "../components/ClickSpark/ClickSpark"
import Fitur from "../components/Fitur/Fitur"
import Footer from "../components/Footer/Footer"
import Hero from "../components/Hero/Hero"
import Leaderboard from "../components/Leaderboard/Leaderboard"
import Logo from "../components/Logo"
import Navbar from "../components/Navbar/Navbar"
import Overview from "../components/Overview/Overview"
import ProductCategory from "../components/ProductCategory/ProductCategory"

export default function Home(){
    return(
        <section>
            <ClickSpark
            sparkColor='#4a7c23'
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
            >
            <div>
            <Navbar />
            </div>
            {/* wrapped sections with ids for navbar targets */}
            <section id="hero"><Hero /></section>
            <section id="overview"><Overview /></section>
            <section id="logo"><Logo /></section>
            <section id="fitur"><Fitur /></section>
            <section id="products"><ProductCategory /></section>
            <section id="leaderboard"><Leaderboard /></section>
            <section id="footer"><Footer /></section>
            </ClickSpark>
        </section>
    )
}