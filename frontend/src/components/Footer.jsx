import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-t border-primary/10 bg-[#221012] py-12 px-4 md:px-20">
            <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <Link to="/" className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-2xl">movie_filter</span>
                        <h2 className="text-lg font-black leading-tight tracking-tighter uppercase">MOVIESTREAM</h2>
                    </Link>
                    <p className="text-slate-400 text-sm">Experience the best of cinematic storytelling from around the world. Stream the latest movies and TV shows anytime, anywhere.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-slate-100">Explore</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><Link to="/explore" className="hover:text-primary transition-colors">Movies</Link></li>
                        <li><Link to="/explore?type=tv" className="hover:text-primary transition-colors">TV Shows</Link></li>
                        <li><Link to="/explore?sort=top_rated" className="hover:text-primary transition-colors">Top Rated</Link></li>
                        <li><Link to="/explore?sort=upcoming" className="hover:text-primary transition-colors">Upcoming</Link></li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-slate-100">Support</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-slate-100">Subscribe</h4>
                    <div className="flex gap-2">
                        <input className="flex-1 rounded-sm bg-primary/10 border-none text-sm text-slate-100 px-3 py-2 focus:ring-primary" placeholder="Email Address" type="email" />
                        <button className="bg-primary text-white font-bold py-2 px-4 rounded-sm hover:brightness-110 transition-all">Join</button>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <a className="text-slate-400 hover:text-primary" href="#"><span className="material-symbols-outlined">public</span></a>
                        <a className="text-slate-400 hover:text-primary" href="#"><span className="material-symbols-outlined">share</span></a>
                        <a className="text-slate-400 hover:text-primary" href="#"><span className="material-symbols-outlined">link</span></a>
                    </div>
                </div>
            </div>
            <div className="mt-12 text-center text-xs text-slate-500">
                © 2024 MOVIESTREAM Inc. All rights reserved.
            </div>
        </footer>
    );
}
