-- users (Supabase Auth와 연동, auth.users 미러)
CREATE TABLE public.users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text UNIQUE NOT NULL,
  name        text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own" ON public.users
  FOR ALL USING (id = auth.uid());

-- 신규 가입 시 users 레코드 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- contacts
CREATE TABLE public.contacts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name        text NOT NULL,
  company     text,
  position    text,
  phone       text,
  email       text,
  memo        text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_own" ON public.contacts
  FOR ALL USING (user_id = auth.uid());

-- contact_tags
CREATE TABLE public.contact_tags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id  uuid REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  tag         text NOT NULL
);
ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_tags_own" ON public.contact_tags
  FOR ALL USING (
    contact_id IN (SELECT id FROM public.contacts WHERE user_id = auth.uid())
  );

-- meetings
CREATE TABLE public.meetings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title        text,
  location     text,
  scheduled_at timestamptz NOT NULL,
  status       text DEFAULT 'upcoming' CHECK (status IN ('upcoming','completed','cancelled')),
  notes        text,
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meetings_own" ON public.meetings
  FOR ALL USING (user_id = auth.uid());

-- meeting_contacts
CREATE TABLE public.meeting_contacts (
  meeting_id  uuid REFERENCES public.meetings(id) ON DELETE CASCADE,
  contact_id  uuid REFERENCES public.contacts(id) ON DELETE CASCADE,
  PRIMARY KEY (meeting_id, contact_id)
);
ALTER TABLE public.meeting_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meeting_contacts_own" ON public.meeting_contacts
  FOR ALL USING (
    meeting_id IN (SELECT id FROM public.meetings WHERE user_id = auth.uid())
  );

-- briefs
CREATE TABLE public.briefs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id   uuid REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL UNIQUE,
  content      jsonb,
  generated_at timestamptz DEFAULT now(),
  status       text DEFAULT 'pending' CHECK (status IN ('pending','ready','failed'))
);
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "briefs_own" ON public.briefs
  FOR ALL USING (
    meeting_id IN (SELECT id FROM public.meetings WHERE user_id = auth.uid())
  );

-- meeting_history
CREATE TABLE public.meeting_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  meeting_id  uuid REFERENCES public.meetings(id),
  contact_id  uuid REFERENCES public.contacts(id),
  food        text,
  topics      text[],
  notes       text,
  met_at      timestamptz
);
ALTER TABLE public.meeting_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meeting_history_own" ON public.meeting_history
  FOR ALL USING (user_id = auth.uid());

-- 인덱스
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX idx_meetings_scheduled_at ON public.meetings(scheduled_at);
CREATE INDEX idx_briefs_meeting_id ON public.briefs(meeting_id);
