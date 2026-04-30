import { supabase } from './supabase';

// Récupérer tous les chevaux publiés
export async function getHorses() {
  const { data, error } = await supabase
    .from('horses')
    .select('*, profiles(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Récupérer les chevaux d'un vendeur
export async function getSellerHorses(sellerId) {
  const { data, error } = await supabase
    .from('horses')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Créer un cheval
export async function createHorse(horse) {
  const { data, error } = await supabase
    .from('horses')
    .insert(horse)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Modifier un cheval
export async function updateHorse(id, updates) {
  const { data, error } = await supabase
    .from('horses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Supprimer un cheval
export async function deleteHorse(id) {
  const { error } = await supabase
    .from('horses')
    .delete()
    .eq('id', id);
  if (error) throw error;
}