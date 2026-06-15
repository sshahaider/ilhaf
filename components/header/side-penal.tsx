'use client';

import React from 'react';
import { LinkItem } from './link-item';
import { HomeIcon, LogIn, MessageCircleWarning, PlusIcon, UserIcon, HeartHandshake } from 'lucide-react';
import { FavoriteBeforeIcon, LyricsIcon } from '../icons';
import { MenuIcon } from '../icons';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose, SheetFooter } from '../ui/sheet';
import Logo from '../Logo';
import { Button } from '../ui/button';
import { authClient } from '@/lib/auth-client';
import { SessionUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const Links = [
	{
		title: 'Home',
		link: '/',
		icon: HomeIcon,
	},
	{
		title: 'Lyrics',
		link: '/lyrics',
		icon: LyricsIcon,
	},
	{
		title: 'Request Lyrics',
		link: '/requests?tab=new-request',
		icon: PlusIcon,
	},
	{
		title: 'Support',
		link: '/support',
		icon: HeartHandshake,
	},
	{
		title: 'Account',
		link: '/account',
		icon: UserIcon,
	},
	{
		title: 'Favorites',
		link: '/favorites',
		icon: FavoriteBeforeIcon,
	},
	{
		title: 'Requests',
		link: '/requests',
		icon: MessageCircleWarning,
	},
];
const SidePenal = ({ initialUser }: { initialUser?: SessionUser }) => {
	const { data: session } = authClient.useSession();
	const user = session?.user ?? initialUser;

	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.refresh();
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="md:hidden">
					<MenuIcon />
				</Button>
			</SheetTrigger>
			<SheetContent className="flex h-full max-w-[60%] flex-col items-start justify-between sm:max-w-sm" side="left">
				<SheetHeader>
					<Logo size="sm" />
				</SheetHeader>
				<div className="w-full space-y-1 p-4">
					{Links.map((item, i) => (
						<SheetClose key={i} asChild>
							<LinkItem item={item} />
						</SheetClose>
					))}
				</div>
				<SheetFooter className="flex w-full justify-center">
					{user ? (
						<Button className="w-full" variant="outline" onClick={handleSignOut}>
							Sign Out
						</Button>
					) : (
						<LinkItem
							item={{
								title: 'Join Us',
								link: '/auth',
								icon: LogIn,
							}}
						/>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default SidePenal;
