# Session State — 2026-04-11 22:45

## Branch
main

## Completed This Session
- feat(brief-invite): table brief_invitations + RLS + Edge Function create-project-from-brief
- feat(brief-invite): hook useBriefInvitation + page ClientBriefInvitePage + route App.tsx + BriefInviteModal
- fix(brief-invite): RLS anon INSERT manquant — lien ne s'affichait pas
- design: redesign Dark Premium (fond #0a0118, orbes, glassmorphism, shimmer)
- fix: overscroll blanc + scroll horizontal supprimé

## Next Task
Créer mini-projet Next.js séparé (next-public/) pour pages publiques clients :
- /brief-invite/[token], /brief/[token], /portal/[token]
Déployer sur Vercel indépendamment. CRM Vite reste inchangé.

## Blockers
- Domaine app-propulseo.vercel.app : à configurer manuellement depuis dashboard Vercel (crm-v2s-projects)

## Key Context
- Projet Vercel actif : crm-v2 (prj_cgIsTg95qHNLyK33BicCCLHlpAHu) team crm-v2s-projects — PAS crm-propulseo-v2
- Supabase project_id : wftozvnvstxzvfplveyz
- Email Resend : onboarding@resend.dev (envoie uniquement à lyestriki@gmail.com)
- App = React 18 + Vite SPA — pas Next.js
- Dark Premium design : src/modules/ClientBrief/ClientBriefInvitePage.tsx
