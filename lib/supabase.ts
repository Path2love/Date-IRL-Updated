import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'free_trial' | 'premium_discount' | 'extended_searches' | 'free_premium';
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouponRedemption {
  id: string;
  coupon_id: string;
  user_email: string;
  redeemed_at: string;
  ip_address: string | null;
}

export interface UserSubscription {
  id: string;
  email: string;
  subscription_type: 'free' | 'premium';
  search_count: number;
  coupon_code_used: string | null;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const validateCouponCode = async (code: string): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error) {
      return { valid: false, error: 'Failed to validate coupon' };
    }

    if (!data) {
      return { valid: false, error: 'Invalid coupon code' };
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'Coupon has expired' };
    }

    if (data.max_uses && data.current_uses >= data.max_uses) {
      return { valid: false, error: 'Coupon has reached maximum uses' };
    }

    return { valid: true, coupon: data };
  } catch (err) {
    return { valid: false, error: 'Error validating coupon' };
  }
};

export const redeemCoupon = async (couponId: string, userEmail: string): Promise<boolean> => {
  try {
    const { error: redemptionError } = await supabase
      .from('coupon_redemptions')
      .insert({
        coupon_id: couponId,
        user_email: userEmail,
        ip_address: null
      });

    if (redemptionError) {
      console.error('Failed to create redemption:', redemptionError);
      return false;
    }

    const { error: updateError } = await supabase.rpc('increment_coupon_uses', { coupon_id: couponId });

    if (updateError) {
      console.error('Failed to increment coupon uses:', updateError);
    }

    return true;
  } catch (err) {
    console.error('Error redeeming coupon:', err);
    return false;
  }
};

export const createOrUpdateSubscription = async (
  email: string,
  subscriptionType: 'free' | 'premium',
  couponCode?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        email,
        subscription_type: subscriptionType,
        coupon_code_used: couponCode || null,
        search_count: 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      });

    return !error;
  } catch (err) {
    console.error('Error creating subscription:', err);
    return false;
  }
};
