import Logo from '../Logo';
import Link from 'next/link';
import SidePenal from './side-penal';
import UserSession from './user-session';
import { SearchCombobox } from './search-box';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { DesktopNav } from './desktop-nav';
import { getCurrentUser } from '@/lib/auth';

export default async function Header() {
	const user = await getCurrentUser();

	return (
		<header
			className={cn(
				'bg-background/90 supports-backdrop-filter:bg-background/75 backdrop-blur-sm',
				'sticky top-0 z-50',
				'border-b',
			)}
		>
			<nav className={cn('bp-x container h-14', 'flex items-center justify-between', 'lg:border-x')}>
				<Link href="/" className="flex items-center">
					<Logo size="sm" />
				</Link>
				<div className="flex items-center gap-x-2">
					<DesktopNav />
					<ThemeToggle />
					<SearchCombobox />
					<UserSession initialUser={user} />
					<SidePenal initialUser={user} />
				</div>
			</nav>
		</header>
	);
}
