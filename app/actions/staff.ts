'use server';

import { createSupabaseAdminClient } from '@/lib/server/auth-route-utils';
import { getSessionAction } from '@/app/actions/auth';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

type CreateStaffResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function createStaffAction(formData: {
  name: string;
  email: string;
  passwordConfirm: string; // Contraseña inicial que el admin le asignará a su barista
}): Promise<CreateStaffResult> {
  const session = await getSessionAction();
  if (!session) return { success: false, error: 'No autorizado.' };

  const adminId = (session as { id?: string }).id;
  const adminRole = (session as { role?: string }).role;

  if (adminRole !== 'admin' || !adminId) {
    return { success: false, error: 'No tienes permisos de administrador para realizar esta acción.' };
  }

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    // 1. Averiguar qué negocio le pertenece a este administrador logueado
    const { data: business, error: bizError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('owner_id', adminId)
      .maybeSingle();

    if (bizError || !business) {
      return { success: false, error: 'No se encontró ningún negocio vinculado a tu cuenta de administrador.' };
    }

    // 2. Verificar que el correo del barista no esté registrado ya en el sistema
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', formData.email.trim().toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: 'Este correo electrónico ya está registrado en Perko.' };
    }

    // 3. Encriptar la contraseña inicial con Bcrypt (12 rondas de seguridad)
    const hashedPassword = await bcrypt.hash(formData.passwordConfirm, 12);
    const newStaffId = crypto.randomUUID();

    // 4. Insertar el nuevo perfil del barista en la tabla pública profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: newStaffId,
        email: formData.email.trim().toLowerCase(),
        name: formData.name.trim(),
        role: 'staff', // 🔥 Rol asignado explícitamente
        custom_password_hash: hashedPassword
      }]);

    if (profileError) throw profileError;

    // 5. Vincular al barista con el negocio
    const { error: staffRelError } = await supabaseAdmin
      .from('business_staff')
      .insert([{
        staff_id: newStaffId,
        business_id: business.id
      }]);

    if (staffRelError) throw staffRelError;

    return { 
      success: true, 
      message: `¡Empleado ${formData.name} registrado con éxito! Ya puede iniciar sesión con su correo.` 
    };

  } catch (err: any) {
    console.error('Error crítico en createStaffAction:', err);
    return { success: false, error: 'Ocurrió un error interno al dar de alta al empleado.' };
  }
}