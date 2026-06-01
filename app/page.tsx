import Link from 'next/link'
import { ArrowRight, BarChart2, Lock, Smartphone, Download, Tag, Search } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: BarChart2,
    title: 'Dashboard Visual',
    description:
      'Gráficos de pizza por categoria e cards de resumo mensal com receitas, despesas e saldo.',
  },
  {
    icon: Tag,
    title: 'Categorias',
    description:
      'Classifique cada transação por categoria e entenda onde seu dinheiro está indo.',
  },
  {
    icon: Search,
    title: 'Filtros e Busca',
    description: 'Filtre por mês, ano e categoria. Busque transações por descrição.',
  },
  {
    icon: Download,
    title: 'Exportar CSV',
    description: 'Exporte suas transações filtradas para planilha com um clique.',
  },
  {
    icon: Lock,
    title: 'Seguro e Privado',
    description:
      'Autenticação segura e seus dados isolados com Row Level Security no Supabase.',
  },
  {
    icon: Smartphone,
    title: 'Responsivo',
    description: 'Use no celular, tablet ou desktop. Interface adaptável a qualquer tela.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">FinançasFácil</span>
          </div>
          <div className="flex gap-2">
            <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
              Entrar
            </Link>
            <Link href="/register" className={buttonVariants({})}>
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>Controle financeiro simples e visual</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Suas finanças sob controle,{' '}
          <span className="text-primary">sem complicação</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Registre receitas e despesas, visualize um dashboard completo e entenda para onde vai o
          seu dinheiro — tudo em um lugar só.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className={cn(buttonVariants({ size: 'lg' }))}>
            Criar conta grátis <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Tudo que você precisa</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Uma plataforma completa para gestão financeira pessoal, com design moderno e fácil de
              usar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-background rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para organizar suas finanças?</h2>
        <p className="text-muted-foreground mb-8">
          Crie sua conta gratuitamente e comece a controlar seus gastos hoje.
        </p>
        <Link href="/register" className={cn(buttonVariants({ size: 'lg' }))}>
          Começar agora <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>FinançasFácil</span>
          </div>
          <span>© 2025 Todos os direitos reservados</span>
        </div>
      </footer>
    </div>
  )
}
