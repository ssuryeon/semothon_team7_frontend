import {createClient} from '@supabase/supabase-js'
console.log(import.meta.env)

// vite에서는 process.env 말고 import.meta.env 사용
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

export async function signUp(name:string, email:string, password:string) {
    console.log(`[signUp start] name: ${name}, email: ${email}, password: ${password}`)
    const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                }
            }
    })
    if(error) {
        alert('회원가입 중 오류 발생');
        console.log(error);
        return null;
    }
    console.log(`${data.user?.id}님 회원가입 되었습니다.`);
    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;
    const userinfo = data.user;
    return {accessToken, refreshToken, userinfo};
}

export async function login(email:string, password:string) {
    console.log(`[login start] email: ${email}, password: ${password}`)
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if(error) {
        alert('로그인 중 오류 발생');
        console.log(error);
        return null;
    }
    console.log(`${data.user.id}님 로그인 되었습니다.`);
    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;
    const userinfo = data.user;
    return {accessToken, refreshToken, userinfo}
}