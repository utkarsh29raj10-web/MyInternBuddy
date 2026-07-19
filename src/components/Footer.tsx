import {SITE_CONFIG} from "@/constants/config";

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-auto text-center border-t border-secondary border-opacity-10 bg-background">
            <p className="font-sans text-r text-secondary opacity-60 px-4">
                {SITE_CONFIG.brandName}.
            </p>
            {/*<p className="font-sans text-s text-secondary opacity-80 px-4">*/}
            {/*    "Success is not final and failure is not fatal: it is the courage to continue that counts."*/}
            {/*</p>*/}
        </footer>
    );
}