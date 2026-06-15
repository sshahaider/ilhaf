import { CardType } from '@/types';
import Link from 'next/link';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { capitalize, cn, getImageURL, getLyricsURL } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { AnimatedImage } from './animated-image';

interface Props {
	data: CardType;
	index?: number;
}

export const LyricsCard = ({ data }: Props) => {
	const { title, slug, type, dop, oldSlug } = data;
	const date = new Date(dop);
	const isNew = differenceInDays(new Date(), date) <= 3;

	return (
		<Link
			href={getLyricsURL(slug)}
			className="hover:bg-accent/80 active:bg-accent hover:text-accent-foreground relative flex flex-col rounded-lg p-2 duration-100"
			prefetch={true}
			scroll={false}
		>
			<AnimatedImage alt={title} src={getImageURL({ slug, oldSlug })} />
			<div className="space-y-1 px-1 pt-2 pb-1">
				<div className="flex items-center gap-1">
					<LyricsCardBadge className="animate-in fade-in duration-300">{capitalize(type)} </LyricsCardBadge>
					<LyricsCardBadge className="animate-in fade-in duration-300">{date.getFullYear()}</LyricsCardBadge>
					{isNew && <LyricsCardBadge>New</LyricsCardBadge>}
				</div>
				<h3 className="animate-in fade-in w-full max-w-[320px] truncate text-base font-semibold duration-300 lg:text-lg xl:text-xl">
					{title}
				</h3>
			</div>
		</Link>
	);
};

export function LyricsCardBadge({ children, className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'bg-secondary/50 border text-secondary-foreground h-5 rounded-sm p-1 font-mono text-[11px] leading-none font-light',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function LyricsCardBadgeSkeleton() {
	return <Skeleton className="h-5 w-10 rounded-sm" />;
}

export const LyricsCardSkeleton = () => {
	return (
		<div className="flex flex-col rounded-lg p-2">
			<AspectRatio ratio={16 / 9} className="relative">
				<Skeleton className="aspect-video h-full w-full" />
			</AspectRatio>
			<div className="space-y-1 px-1 py-2">
				<div className="flex items-center gap-1">
					<LyricsCardBadgeSkeleton />
					<LyricsCardBadgeSkeleton />
				</div>
				<Skeleton className="h-[1.5rem] w-2/3 lg:h-[1.5556rem] xl:h-[1.4rem]" />
			</div>
		</div>
	);
};
