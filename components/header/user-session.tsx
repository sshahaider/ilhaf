'use client';
import React from 'react';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { LayoutDashboardIcon, MessageCircleWarning, UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAvatarUrl, getInitialChar } from '@/lib/utils';
import { FavoriteBeforeIcon } from '../icons';
import { authClient } from '@/lib/auth-client';
import { SessionUser } from '@/lib/auth';
import { useToggle } from '@/hooks/use-toggle';
import { useRouter } from 'next/navigation';

const UserSession = ({ initialUser }: { initialUser?: SessionUser }) => {
	const { data: session, isPending } = authClient.useSession();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setAuthOpen] = useToggle('auth-modal');
	const user = session?.user ?? initialUser;
	const isAdmin = user?.role === 'admin';
	const router = useRouter();

	if (isPending && !initialUser) {
		return null;
	}

	const handleSignOut = async () => {
		await authClient.signOut();
		router.refresh();
	};

	return (
		<div className="animate-in fade-in hidden items-center duration-800 md:flex">
			{user?.email ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className="rounded-md">
							<AvatarImage className="rounded-md border" src={getAvatarUrl(user.image, user.id)} />
							<AvatarFallback className="rounded-md border">{getInitialChar(user.name)}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="mr-5 max-w-sm">
						<DropdownMenuItem className="flex items-center justify-start gap-2">
							<DropdownMenuLabel>
								<span className="">Signed In as {isAdmin && 'Admin'}</span> <br />
								<div className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap opacity-70">
									{user.email}
								</div>
							</DropdownMenuLabel>
						</DropdownMenuItem>
						{isAdmin && (
							<DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href={`/admin`} className="w-full cursor-pointer">
										<LayoutDashboardIcon />
										Admin Dashboard
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href={`/account`} className="w-full cursor-pointer">
									<UserIcon />
									Account
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Link href={`/favorites`} className="w-full cursor-pointer">
									<FavoriteBeforeIcon />
									Favorites
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`/requests?tab=requests`} className="w-full cursor-pointer">
									<MessageCircleWarning />
									Requests
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem className="w-full cursor-pointer" onClick={handleSignOut}>
								Log out
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button onClick={() => setAuthOpen(true)} variant="outline">
					Join Us
				</Button>
			)}
		</div>
	);
};

export default UserSession;
