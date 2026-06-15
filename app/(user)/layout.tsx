import AuthModel from '@/components/auth/auth-model';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ScrollToTop } from '@/components/scroll-to-top';
import { cn } from '@/lib/utils';

export default function UsersLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
			<ScrollToTop />
			<Header />
			<main
				className={cn(
					'relative container grow',
					'before:bg-border before:absolute before:inset-y-0 before:left-0 lg:before:w-px',
					'after:bg-border after:absolute after:inset-y-0 after:right-0 lg:after:w-px',
				)}
			>
				{children}
			</main>
			<Footer />
			<AuthModel />
		</div>
	);
}
