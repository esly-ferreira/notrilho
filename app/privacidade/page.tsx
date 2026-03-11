import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = {
  title: "Política de Privacidade | Notrilho",
  description: "Política de Privacidade do Notrilho - como coletamos e utilizamos informações.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-zinc-900 hover:text-zinc-700">
            Notrilho
          </Link>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          Última atualização: 10 de março de 2026
        </p>

        <p className="text-zinc-700 mb-6">
          Esta Política de Privacidade descreve como o <strong>Notrilho</strong> coleta e utiliza informações ao utilizar o site.
        </p>
        <p className="text-zinc-700 mb-8">
          Ao acessar ou utilizar a plataforma, você concorda com os termos desta política.
        </p>

        <hr className="border-zinc-200 my-8" />

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">1. Informações coletadas</h2>
          <p className="text-zinc-700 mb-4">
            O <strong>Notrilho</strong> coleta apenas informações técnicas mínimas necessárias para o funcionamento do serviço.
          </p>
          <p className="text-zinc-700 mb-3">As informações que podem ser coletadas incluem:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-4">
            <li>endereço IP do dispositivo</li>
            <li>localização aproximada baseada na conexão de rede</li>
            <li>data e horário do acesso</li>
            <li>identificador de sessão (session_id)</li>
          </ul>
          <p className="text-zinc-700">
            Essas informações não identificam diretamente o usuário e são utilizadas apenas para o funcionamento da plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">2. Finalidade da coleta</h2>
          <p className="text-zinc-700 mb-3">As informações coletadas são utilizadas exclusivamente para:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-4">
            <li>permitir o funcionamento do sistema de alertas colaborativos</li>
            <li>evitar abusos, spam e uso automatizado indevido da plataforma</li>
            <li>melhorar a estabilidade e segurança do serviço</li>
          </ul>
          <p className="text-zinc-700">
            O <strong>Notrilho</strong> não utiliza essas informações para fins de marketing ou publicidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">3. Compartilhamento de dados</h2>
          <p className="text-zinc-700 mb-4">
            O <strong>Notrilho</strong> não vende, aluga ou compartilha dados dos usuários com terceiros.
          </p>
          <p className="text-zinc-700">
            Os dados podem ser armazenados em serviços de infraestrutura utilizados para operar o site, como provedores de hospedagem e banco de dados.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">4. Armazenamento e segurança</h2>
          <p className="text-zinc-700 mb-4">
            As informações coletadas são armazenadas de forma segura e apenas pelo tempo necessário para o funcionamento do sistema e prevenção de abusos.
          </p>
          <p className="text-zinc-700">
            Medidas técnicas são adotadas para proteger os dados contra acesso não autorizado.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">5. Alterações nesta política</h2>
          <p className="text-zinc-700 mb-4">
            Esta Política de Privacidade pode ser atualizada periodicamente para refletir melhorias ou mudanças no funcionamento da plataforma.
          </p>
          <p className="text-zinc-700">
            Recomendamos que os usuários revisem esta página ocasionalmente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">6. Contato</h2>
          <p className="text-zinc-700 mb-4">
            Em caso de dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail:
          </p>
          <p className="text-zinc-700">
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-zinc-900 font-medium">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <hr className="border-zinc-200 my-8" />

        <p className="text-sm text-zinc-500">
          <Link href="/" className="underline hover:text-zinc-700">Voltar ao início</Link>
        </p>
      </article>
    </div>
  );
}
