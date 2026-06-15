'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

function scrollToTop() {
	const scrollingElement = document.scrollingElement;
	if (scrollingElement) {
		scrollingElement.scrollTop = 0;
	}
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
	window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

export function ScrollToTop() {
	const pathname = usePathname();

	useLayoutEffect(() => {
		scrollToTop();

		// Next.js may restore scroll after route transitions on desktop when the
		// page segment is still considered visible — run again on the next frames.
		const raf = requestAnimationFrame(() => {
			scrollToTop();
			requestAnimationFrame(scrollToTop);
		});
		const timer = window.setTimeout(scrollToTop, 0);

		return () => {
			cancelAnimationFrame(raf);
			window.clearTimeout(timer);
		};
	}, [pathname]);

	return null;
}
