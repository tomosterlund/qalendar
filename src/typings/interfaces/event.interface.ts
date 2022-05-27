export type eventId = string | number

export interface eventInterface {
	id: eventId;
	title: string;
	time: { start: string, end: string }; // YYYY-MM-DD hh:mm
	description?: string;
	topic?: string;
	location?: string;
	schoolId?: string;
	with?: string;
	colorScheme?: string;
	color?: 'blue' | 'yellow' | 'green' | 'red'; // Says 'color', but represents CSS-Property background-color
	isEditable?: boolean;

	// These are properties that should never be fed into the editor
	// Instead, they are assigned events, in order to for example position/style them correctly
	zIndex?: number;
	nOfPreviousConcurrentEvents?: number;
	totalConcurrentEvents?: number;
}