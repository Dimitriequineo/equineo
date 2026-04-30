import { supabase } from './supabase';

// Inscription
export async function signUp(email, password, name, role) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  });
  if (error) throw error;

  // Créer le profil
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      role,
      plan: 'free',
      avatar: name.charAt(0).toUpperCase()
    });
  }
  return data;
}

// Connexion
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

// Déconnexion
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Récupérer l'utilisateur connecté
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}