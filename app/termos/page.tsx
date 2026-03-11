import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata = {
  title: "Termos de Uso | Notrilho",
  description: "Termos de Uso do Notrilho - plataforma de informações colaborativas sobre trens.",
};

export default function TermosPage() {
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
          Termos de Uso
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          Última atualização: 10 de março de 2026
        </p>

        <p className="text-zinc-700 mb-6">
          Bem-vindo(a) ao <strong>Notrilho</strong>. Estes Termos de Uso regulam o acesso e a utilização do site e dos serviços oferecidos pela plataforma.
        </p>
        <p className="text-zinc-700 mb-8">
          Ao acessar ou utilizar o site, você concorda com estes Termos de Uso. Caso não concorde com qualquer parte destes termos, recomendamos que não utilize a plataforma.
        </p>

        <hr className="border-zinc-200 my-8" />

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">1. Sobre o serviço</h2>
          <p className="text-zinc-700 mb-4">
            O <strong>Notrilho</strong> é uma plataforma digital independente que permite aos usuários compartilhar informações colaborativas sobre a situação de linhas ferroviárias, estações e circulação de trens.
          </p>
          <p className="text-zinc-700 mb-4">
            As informações exibidas no site são enviadas por usuários da própria plataforma e têm caráter <strong>informativo e colaborativo</strong>.
          </p>
          <p className="text-zinc-700">
            O serviço não possui vínculo, parceria ou afiliação com empresas operadoras de transporte ferroviário.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">2. Natureza das informações</h2>
          <p className="text-zinc-700 mb-3">As informações exibidas na plataforma:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-4">
            <li>são enviadas por usuários;</li>
            <li>podem conter erros, atrasos ou imprecisões;</li>
            <li>não devem ser consideradas fontes oficiais.</li>
          </ul>
          <p className="text-zinc-700 mb-4">
            O <strong>Notrilho</strong> não garante a precisão, integridade ou atualização das informações apresentadas.
          </p>
          <p className="text-zinc-700">
            O usuário reconhece que qualquer decisão tomada com base nas informações exibidas é de sua própria responsabilidade.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">3. Uso da plataforma</h2>
          <p className="text-zinc-700 mb-3">Ao utilizar o site, o usuário concorda em:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-4">
            <li>utilizar o serviço apenas para fins legítimos;</li>
            <li>não enviar informações falsas de forma intencional;</li>
            <li>não realizar atividades que possam prejudicar o funcionamento da plataforma;</li>
            <li>não tentar acessar sistemas, bancos de dados ou funcionalidades restritas.</li>
          </ul>
          <p className="text-zinc-700">
            O uso da plataforma deve respeitar as leis aplicáveis no Brasil.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">4. Conteúdo enviado pelos usuários</h2>
          <p className="text-zinc-700 mb-4">
            Os alertas e informações enviados pelos usuários são de responsabilidade exclusiva de quem os publicou.
          </p>
          <p className="text-zinc-700 mb-3">
            Ao enviar um alerta ou informação na plataforma, o usuário declara que:
          </p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-4">
            <li>a informação foi enviada de boa-fé;</li>
            <li>não possui intenção de causar desinformação ou prejuízo a terceiros.</li>
          </ul>
          <p className="text-zinc-700 mb-3">A plataforma se reserva o direito de:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>remover conteúdos considerados inadequados;</li>
            <li>limitar ou bloquear usuários que abusem do sistema.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">5. Moderação e remoção de conteúdo</h2>
          <p className="text-zinc-700 mb-4">
            O <strong>Notrilho</strong> poderá remover, editar ou limitar a visibilidade de conteúdos enviados pelos usuários sempre que considerar necessário para manter o bom funcionamento da plataforma.
          </p>
          <p className="text-zinc-700 mb-3">Isso inclui, mas não se limita a:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1">
            <li>conteúdo falso ou enganoso;</li>
            <li>abuso do sistema;</li>
            <li>spam ou uso automatizado indevido.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">6. Limitação de responsabilidade</h2>
          <p className="text-zinc-700 mb-3">O <strong>Notrilho</strong> não se responsabiliza por:</p>
          <ul className="list-disc list-inside text-zinc-700 space-y-1 mb-4">
            <li>decisões tomadas com base nas informações exibidas na plataforma;</li>
            <li>atrasos, falhas ou interrupções no funcionamento do serviço;</li>
            <li>danos diretos ou indiretos decorrentes do uso da plataforma.</li>
          </ul>
          <p className="text-zinc-700">
            O serviço é fornecido <strong>&quot;como está&quot;</strong>, sem garantias de disponibilidade contínua ou precisão absoluta das informações.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">7. Privacidade</h2>
          <p className="text-zinc-700">
            O uso da plataforma também está sujeito à <Link href="/privacidade" className="underline hover:text-zinc-900 text-zinc-700">Política de Privacidade</Link>, que descreve como informações técnicas e dados de uso podem ser coletados e utilizados.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">8. Propriedade intelectual</h2>
          <p className="text-zinc-700 mb-4">
            Todo o conteúdo do site, incluindo design, layout, código e estrutura da plataforma, pertence ao <strong>Notrilho</strong>, exceto quando indicado de outra forma.
          </p>
          <p className="text-zinc-700">
            O uso indevido do conteúdo poderá resultar em medidas legais conforme a legislação aplicável.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">9. Modificações do serviço</h2>
          <p className="text-zinc-700">
            O <strong>Notrilho</strong> poderá modificar, suspender ou encerrar partes do serviço a qualquer momento, sem aviso prévio, quando necessário.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">10. Alterações nos Termos de Uso</h2>
          <p className="text-zinc-700 mb-4">
            Estes Termos de Uso podem ser atualizados periodicamente.
          </p>
          <p className="text-zinc-700">
            Recomendamos que os usuários revisem esta página regularmente para acompanhar possíveis alterações.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">11. Legislação aplicável</h2>
          <p className="text-zinc-700">
            Estes termos são regidos pelas leis da República Federativa do Brasil, incluindo o <strong>Marco Civil da Internet</strong> e demais legislações aplicáveis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">12. Contato</h2>
          <p className="text-zinc-700 mb-4">
            Em caso de dúvidas, sugestões ou solicitações relacionadas a estes Termos de Uso, entre em contato através do e-mail:
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
