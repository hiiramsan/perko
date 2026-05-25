import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const flow = searchParams.get('flow') // 'client' | 'owner'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // 1. Obtener el usuario que se acaba de loguear
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // CASO 1: Es un cliente
        if (flow === 'client') {
          // Se dirige a la pantalla de la cartera
          return NextResponse.redirect(`${origin}/client/card`)
        }

        // CASO 2: Es un dueño de negocio
        // Consultar  a la tabla 'businesses' para ver si ya tiene empresa creada
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle() 

        if (business) {
          return NextResponse.redirect(`${origin}/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }
    }

    return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
  }
}