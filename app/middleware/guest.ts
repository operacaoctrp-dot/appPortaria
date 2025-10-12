export default defineNuxtRouteMiddleware((to) => {
  console.log('🔑 Middleware guest executado para:', to.path)
  
  if (process.client) {
    const { user } = useAuth()
    
    console.log('👤 Estado do usuário no guest middleware:', user.value ? 'Logado' : 'Não logado')
    
    if (user.value) {
      console.log('✅ Usuário já logado - redirecionando para home')
      return navigateTo('/')
    }
    
    console.log('🔓 Usuário não logado - permitindo acesso ao login')
  }
})