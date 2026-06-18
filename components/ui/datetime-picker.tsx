'use client';
import React, { useCallback, useEffect } from 'react';
import { useTimescape, type Options } from 'timescape/react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const timePickerSeparatorBase = 'text-sm text-foreground/50';

type DateFormat = 'days' | 'months' | 'years';
type TimeFormat = 'hours' | 'minutes' | 'seconds' | 'am/pm';

type DateTimeArray<T extends DateFormat | TimeFormat> = T[];
type DateTimeFormatDefaults = [DateTimeArray<DateFormat>, DateTimeArray<TimeFormat>];

const DEFAULTS = [
	['months', 'days', 'years'],
	['hours', 'minutes', 'am/pm'],
] as DateTimeFormatDefaults;

type TimescapeReturn = ReturnType<typeof useTimescape>;
type InputPlaceholders = Record<DateFormat | TimeFormat, string>;
const INPUT_PLACEHOLDERS: InputPlaceholders = {
	months: 'MM',
	days: 'DD',
	years: 'YYYY',
	hours: 'HH',
	minutes: 'MM',
	seconds: 'SS',
	'am/pm': 'AM/PM',
};

function DatetimeGrid({
	format,
	className,
	timescape,
	disabled,
	placeholders,
	...props
}: React.ComponentProps<'div'> & {
	format: DateTimeFormatDefaults;
	className?: string;
	timescape: Pick<TimescapeReturn, 'getRootProps' | 'getInputProps'>;
	placeholders: InputPlaceholders;
	disabled?: boolean;
}) {
	return (
		<div
			className={cn('bg-input/30 flex w-full items-center border p-1', className, 'gap-1 rounded-md')}
			{...timescape.getRootProps()}
			ref={props.ref}
		>
			{!!format?.length
				? format.map((group, i) => (
						<React.Fragment key={i === 0 ? 'dates' : 'times'}>
							{!!group?.length
								? group.map((unit, j) => (
										<React.Fragment key={unit}>
											<Input
												className={cn(
													'content-box focus:bg-foreground/20 dark:focus:bg-foreground/20 inline h-fit min-w-8 rounded-sm border-none p-1 text-center tabular-nums caret-transparent outline-none select-none focus-visible:ring-0 focus-visible:outline-none',
													{
														'min-w-12': unit === 'years',
														'bg-foreground/15': unit === 'am/pm',
													},
												)}
												disabled={disabled}
												{...timescape.getInputProps(unit)}
												placeholder={placeholders[unit]}
											/>
											{i === 0 && j < group.length - 1 ? (
												// date separator
												<span className={timePickerSeparatorBase}>/</span>
											) : (
												j < group.length - 2 && (
													// time separator
													<span className={timePickerSeparatorBase}>:</span>
												)
											)}
										</React.Fragment>
									))
								: null}
							{format[1]?.length && !i ? (
								// date-time separator - only if both date and time are present
								<span className={cn(timePickerSeparatorBase, 'text-xl opacity-30')}>|</span>
							) : null}
						</React.Fragment>
					))
				: null}
		</div>
	);
}

const DEFAULT_TS_OPTIONS = {
	date: new Date(),
	hour12: true,
};

function DatetimePicker({
	value,
	format = DEFAULTS,
	placeholders,
	disabled,
	dtOptions = DEFAULT_TS_OPTIONS,
	onChange,
	...props
}: React.ComponentProps<'div'> & {
	value?: Date;
	format: DateTimeFormatDefaults;
	placeholders?: InputPlaceholders;
	onChange?: Options['onChangeDate'];
	dtOptions?: Options;
	disabled?: boolean;
}) {
	const handleDateChange = useCallback(
		(nextDate: Date | undefined) => {
			if (onChange) {
				onChange(nextDate);
			} else {
				console.log(nextDate);
			}
		},
		[onChange],
	);
	const timescape = useTimescape({
		...dtOptions,
		...(value && { date: value }),
		onChangeDate: handleDateChange,
	});

	const valueTimestamp = value?.getTime();
	useEffect(() => {
		if (valueTimestamp === undefined || Number.isNaN(valueTimestamp)) return;
		timescape.update((prev) => {
			if (prev.date?.getTime() === valueTimestamp) return prev;
			return { ...prev, date: new Date(valueTimestamp) };
		});
	}, [valueTimestamp, timescape.update]);

	return (
		<DatetimeGrid
			disabled={disabled}
			format={format}
			timescape={timescape}
			placeholders={placeholders ?? INPUT_PLACEHOLDERS}
			{...props}
		/>
	);
}

export { DatetimeGrid, DatetimePicker };
