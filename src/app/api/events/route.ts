import { NextResponse } from 'next/server';
import { Event } from '@/types';

export async function GET() {
  try {
    // Simulating real environmental events from Brazilian organizations
    // In production, this would fetch from actual event APIs or calendars
    const eventsData: Event[] = [
      {
        id: '1',
        title: 'Congresso Brasileiro de Agroecologia',
        description: 'O maior evento de agroecologia da América Latina reúne pesquisadores, produtores e técnicos para debater avanços e desafios da produção sustentável.',
        type: 'conference',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Centro de Convenções, Recife - PE',
        organizer: 'Associação Brasileira de Agroecologia',
        attendees: 2000,
        isVirtual: false,
        registrationUrl: 'https://www.abagroecologia.org.br/cba2024',
        imageUrl: ''
      },
      {
        id: '2',
        title: 'Workshop de Monitoramento Ambiental com Dados de Satélite',
        description: 'Curso prático sobre utilização de dados de satélite do INPE para monitoramento ambiental e combate ao desmatamento.',
        type: 'workshop',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Online (Zoom)',
        organizer: 'INPE - Instituto Nacional de Pesquisas Espaciais',
        attendees: 150,
        isVirtual: true,
        registrationUrl: 'https://www.inpe.br/cursos/monitoramento',
        imageUrl: ''
      },
      {
        id: '3',
        title: 'Simpósio Internacional de Biodiversidade do Cerrado',
        description: 'Evento científico apresentando as mais recentes pesquisas sobre biodiversidade, conservação e uso sustentável do Cerrado.',
        type: 'conference',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Universidade de Brasília, Brasília - DF',
        organizer: 'Sociedade de Botânica do Brasil',
        attendees: 500,
        isVirtual: false,
        registrationUrl: 'https://www.botanica.org.br/simposio-cerrado',
        imageUrl: ''
      },
      {
        id: '4',
        title: 'Encontro Nacional de Produtores Agroflorestais',
        description: 'Reunião de produtores rurais para troca de experiências sobre sistemas agroflorestais e comercialização de produtos sustentáveis.',
        type: 'meeting',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Sindicato Rural, Londrina - PR',
        organizer: 'Federação da Agricultura do Paraná',
        attendees: 200,
        isVirtual: false,
        registrationUrl: 'https://www.faep.org.br/eventos',
        imageUrl: ''
      },
      {
        id: '5',
        title: 'Curso de Perícia Ambiental e Valoração de Danos',
        description: 'Capacitação para profissionais que atuam na área de perícia ambiental, incluindo metodologias de valoração de danos ecológicos.',
        type: 'course',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Online (Google Meet)',
        organizer: 'Instituto O Direito por um Planeta Verde',
        attendees: 80,
        isVirtual: true,
        registrationUrl: 'https://www.planetaverde.org.br/cursos',
        imageUrl: ''
      },
      {
        id: '6',
        title: 'Fórum Brasileiro de Mudanças Climáticas',
        description: 'Fórum anual que discute políticas públicas, soluções tecnológicas e estratégias de adaptação às mudanças climáticas no Brasil.',
        type: 'conference',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        location: 'Centro de Convenções, São Paulo - SP',
        organizer: 'Fórum Brasileiro de Mudanças Climáticas',
        attendees: 1200,
        isVirtual: false,
        registrationUrl: 'https://www.fbmc.org.br/forum2024',
        imageUrl: ''
      },
      {
        id: '7',
        title: 'Webinar: Energias Renováveis na Amazônia',
        description: 'Palestra online sobre o potencial de energias solar e eólica na região amazônica e desafios para implementação.',
        type: 'workshop',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: 'Online (YouTube Live)',
        organizer: 'Instituto Socioambiental (ISA)',
        attendees: 300,
        isVirtual: true,
        registrationUrl: 'https://www.socioambiental.org/webinars',
        imageUrl: ''
      },
      {
        id: '8',
        title: 'Expo Agrofloresta Brasil',
        description: 'Feira internacional de tecnologias e produtos para sistemas agroflorestais, com exposição, palestras e demonstrações de campo.',
        type: 'conference',
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        location: 'Parque de Exposições, Belo Horizonte - MG',
        organizer: 'Associação Brasileira de Agrofloresta',
        attendees: 3000,
        isVirtual: false,
        registrationUrl: 'https://www.expoagrofloresta.com.br',
        imageUrl: ''
      },
      {
        id: '9',
        title: 'Workshop de Restauração Florestal',
        description: 'Treinamento prático sobre técnicas de restauração de áreas degradadas, incluindo seleção de espécies e plantio.',
        type: 'workshop',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'Reserva Biológica, Ubatuba - SP',
        organizer: 'Instituto de Botânica de São Paulo',
        attendees: 40,
        isVirtual: false,
        registrationUrl: 'https://www.ibot.sp.gov.br/cursos',
        imageUrl: ''
      },
      {
        id: '10',
        title: 'Conferência Nacional de Proteção à Biodiversidade',
        description: 'Evento governamental que define diretrizes nacionais para conservação da biodiversidade e uso sustentável de recursos naturais.',
        type: 'conference',
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        location: 'Brasília - DF',
        organizer: 'Ministério do Meio Ambiente',
        attendees: 800,
        isVirtual: true,
        registrationUrl: 'https://www.gov.br/mma/conf-biodiversidade',
        imageUrl: ''
      }
    ];

    return NextResponse.json(eventsData);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}