import {createClient} from '@supabase/supabase-js'

// vite에서는 process.env 말고 import.meta.env 사용
const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY)

async function signUp(id:string, password:string) {
    const {data, error} = await supabase.auth.signUp({
            phone: '',
            password,
            options: {
                data: {
                    id,
                }
            }
    })
}