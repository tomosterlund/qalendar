export type eventId = string | number | symbol

export interface eventInterface {
	id: eventId;
	title: string;
	description?: string;
	topic?: string;
	location?: string;
	schoolId?: string;
	with?: string;
	time: { start: string, end: string }; // YYYY-MM-DD hh:mm
	color?: 'blue' | 'yellow' | 'green' | 'red';

	// These are properties that should never be fed into the editor
	// Instead, they are assigned events, in order to for example position/style them correctly
	zIndex?: number;
	nOfPreviousConcurrentEvents?: number;
	totalConcurrentEvents?: number;
}