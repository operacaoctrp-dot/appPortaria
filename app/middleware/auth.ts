export default defineNuxtRouteMiddleware((to) => {
  console.log('🛡️ Middleware auth executado para:', to.path)
  
  if (process.client) {
    const { user } = useAuth()
    
    console.log('👤 Estado do usuário no middleware:', user.value ? 'Logado' : 'Não logado')
    
    if (!user.value) {
      console.log('❌ Usuário não autenticado - redirecionando para login')
      return navigateTo('/login')
    }
    
    console.log('✅ Usuário autenticado - permitindo acesso')
  }
})