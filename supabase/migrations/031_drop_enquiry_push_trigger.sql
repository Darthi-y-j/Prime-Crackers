-- Enquiry alerts use email only (migration 030). Disable legacy Web Push HTTP hook.

DROP TRIGGER IF EXISTS trg_enquiries_notify_push ON public.enquiries;
DROP FUNCTION IF EXISTS public.notify_enquiry_push_via_http();
