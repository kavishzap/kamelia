/** Shared form state for Event Questionnaire + PDF export */

export type QState = {
  eventType: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueSetting: string;
  city: string;
  guestCount: string;
  themeStyle: string;
  colors: string[];
  floralPrefs: string[];
  stageType: string;
  decorElements: string[];
  budget: string;
  inspirationLinks: string;
  notes: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
};
