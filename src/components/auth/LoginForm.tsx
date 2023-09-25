import {supabase} from '../../config/supabase';

const LoginForm = () => {
    const handleGoogleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          })
        // manejar el inicio de sesión exitoso o el error aquí
        if(error) {
            console.log(error)
        }
        console.log(data)
    }
  return (
    <div className="p-4 border dark:border-zinc-700 rounded-xl  bg-white border-slate-300 dark:bg-zinc-800 shadow-md">
        <h1 className="font-semibold">¡Bienvenido!</h1>
        
            <button onClick={handleGoogleSignIn}>Iniciar sesión con Google</button>
    </div>
  )
}

export default LoginForm