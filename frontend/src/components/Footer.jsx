import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border-dark py-16 px-6 lg:px-20 bg-surface">
            <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <Link to="/" className="flex items-center gap-2 text-primary">
                        <svg className="w-6 h-6 opacity-50" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor" />
                        </svg>
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">© Akshat, 2026 NOIR</span>
                    </Link>
                </div>
                <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <a className="hover:text-primary transition-colors" href="#">Privacy</a>
                    <a className="hover:text-primary transition-colors" href="#">Terms</a>
                    <a className="hover:text-primary transition-colors" href="#">Support</a>
                    <a className="hover:text-primary transition-colors" href="#">Cookies</a>
                </div>
                <div className="flex gap-4">
                    <div className="glass-morphism size-10 rounded-full flex items-center justify-center hover:text-primary cursor-pointer transition-all">
                        <span className="material-symbols-outlined text-xl">share</span>
                    </div>
                    <div className="glass-morphism size-10 rounded-full flex items-center justify-center hover:text-primary cursor-pointer transition-all">
                        <span className="material-symbols-outlined text-xl">language</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
