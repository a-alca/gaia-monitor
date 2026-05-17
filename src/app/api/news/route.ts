import { NextResponse } from 'next/server';
import { News } from '@/types';

export async function GET() {
  try {
    // Simulating real environmental news from Brazilian sources
    // In production, this would fetch from actual news APIs or RSS feeds
    const newsData: News[] = [
      {
        id: '1',
        title: 'INPE lança novo sistema de monitoramento de desmatamento em tempo real',
        summary: 'O Instituto Nacional de Pesquisas Espaciais apresentou tecnologia que permite detectar desmatamento em áreas menores que 1 hectare com até 90% de precisão.',
        content: 'O novo sistema, chamado DETER-B (Detecção de Desmatamento em Tempo Real - Brasileiro), utiliza imagens de satélites de alta resolução combinadas com inteligência artificial. A tecnologia promete revolucionar o combate ao desmatamento ilegal na Amazônia e no Cerrado, permitindo ações mais rápidas das autoridades ambientais. O sistema está operacional desde julho de 2024 e já identificou mais de 2.000 alertas confirmados.',
        source: 'INPE - Instituto Nacional de Pesquisas Espaciais',
        author: 'Coordenação de Observação da Terra',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Tecnologia',
        tags: ['desmatamento', 'monitoramento', 'satélite', 'INPE'],
        externalUrl: 'https://www.inpe.br/noticias/noticia.php?id=5678'
      },
      {
        id: '2',
        title: 'MMA anuncia criação de novas unidades de conservação no bioma Cerrado',
        summary: 'Ministério do Meio Ambiente estabelece 5 novas áreas protegidas totalizando 1,2 milhão de hectares para preservação da biodiversidade do Cerrado.',
        content: 'O Ministério do Meio Ambiente (MMA) formalizou a criação de cinco novas unidades de conservação no bioma Cerrado, somando 1,2 milhão de hectares de áreas protegidas. As novas unidades incluem dois parques nacionais, uma reserva biológica e duas áreas de proteção ambiental. Esta medida faz parte do Plano de Ação para a Prevenção e Controle do Desmatamento no Cerrado (PPCerrado) e representa um avanço significativo na conservação deste bioma, que já perdeu mais de 50% de sua vegetação original.',
        source: 'Ministério do Meio Ambiente',
        author: 'Assessoria de Imprensa',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Meio Ambiente',
        tags: ['Cerrado', 'unidades de conservação', 'biodiversidade', 'MMA'],
        externalUrl: 'https://www.gov.br/mma/pt-br/assuntos/noticias'
      },
      {
        id: '3',
        title: 'Estudo da USP mostra recuperação de 15% da Mata Atlântica em 20 anos',
        summary: 'Pesquisa revela que políticas públicas e iniciativas de restauração contribuíram para a recuperação de áreas degradadas no bioma mais ameaçado do Brasil.',
        content: 'Um estudo inédito da Universidade de São Paulo (USP) publicado na revista Scientific Reports revelou que a Mata Atlântica recuperou aproximadamente 15% de sua cobertura vegetal nos últimos 20 anos. A pesquisa analisou imagens de satélite e dados de campo entre 2000 e 2020, identificando que cerca de 2,5 milhões de hectares foram restaurados neste período. Os pesquisadores atribuem este resultado a uma combinação de políticas públicas eficazes, incentivos fiscais para propriedades rurais e o engajamento da sociedade civil em projetos de reflorestamento.',
        source: 'USP - Universidade de São Paulo',
        author: 'Prof. Dr. Carlos Eduardo',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Meio Ambiente',
        tags: ['Mata Atlântica', 'restauração', 'pesquisa', 'USP'],
        externalUrl: 'https://www.usp.br/noticias'
      },
      {
        id: '4',
        title: 'Alerta de secas severas na região Sul do Brasil para os próximos meses',
        summary: 'Climatologistas do INMET preveem período de estiagem prolongada que pode impactar a agricultura e o abastecimento de água.',
        content: 'O Instituto Nacional de Meteorologia (INMET) emitiu um alerta de seca severa para a região Sul do Brasil. As previsões climáticas indicam um cenário preocupante para os próximos meses, com precipitação abaixo da média histórica para o período. O fenômeno está associado à persistência do La Niña e às mudanças climáticas globais. Especialistas alertam para possíveis impactos na agricultura, especialmente nas culturas de soja e milho, e no abastecimento de água em áreas urbanas e rurais. Governos estaduais já estão preparando planos de contingência.',
        source: 'INMET - Instituto Nacional de Meteorologia',
        author: 'Divisão de Climatologia',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Clima',
        tags: ['seca', 'clima', 'alerta', 'INMET', 'La Niña'],
        externalUrl: 'https://portal.inmet.gov.br/'
      },
      {
        id: '5',
        title: 'WWF-Brasil lança programa de financiamento para agroflorestas na Amazônia',
        summary: 'Organização vai investir R$ 50 milhões em projetos de sistemas agroflorestais para pequenos produtores nos próximos 5 anos.',
        content: 'O WWF-Brasil anunciou o lançamento de um programa de financiamento de R$ 50 milhões para apoiar a implementação de sistemas agroflorestais na Amazônia Legal. O programa, denominado "Agrofloresta Viva", beneficiará diretamente cerca de 5.000 pequenos produtores rurais, oferecendo crédito subsidiado, assistência técnica e capacitação. A iniciativa tem como objetivo conciliar a produção agrícola sustentável com a conservação florestal, gerando renda para as comunidades locais e reduzindo a pressão sobre o desmatamento. O programa será implementado em parceria com governos estaduais, cooperativas agrícolas e instituições de pesquisa.',
        source: 'WWF-Brasil',
        author: 'Programa Amazônia',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Sustentabilidade',
        tags: ['agrofloresta', 'Amazônia', 'financiamento', 'WWF'],
        externalUrl: 'https://www.wwf.org.br/'
      },
      {
        id: '6',
        title: 'Greenpeace documentou 47% aumento em focos de calor na Amazônia em 2024',
        summary: 'Relatório anual da organização ambiental mostra avanço do desmatamento apesar das promessas de combate ao crime ambiental.',
        content: 'O relatório anual do Greenpeace Brasil revelou um aumento de 47% nos focos de calor na Amazônia brasileira em 2024 em comparação com o ano anterior. O documento, baseado em dados do INPE, indica que o desmatamento avançou principalmente em áreas de fronteira agrícola e em terras indígenas. A organização criticou a falta de efetividade das ações de combate ao crime ambiental e pediu maior rigor na fiscalização e punição dos infratores. O relatório também destacou que a maior parte do desmatamento está concentrada em apenas 10 municípios, o que sugere a atuação de grupos organizados.',
        source: 'Greenpeace Brasil',
        author: 'Equipe de Campanhas',
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Meio Ambiente',
        tags: ['desmatamento', 'Amazônia', 'focos de calor', 'Greenpeace'],
        externalUrl: 'https://www.greenpeace.org/brasil/'
      },
      {
        id: '7',
        title: 'Embrapa desenvolve nova tecnologia para recuperação de solos degradados',
        summary: 'Pesquisadores criam biofertilizante à base de microrganismos nativos que aumenta em 300% a produtividade de áreas recuperadas.',
        content: 'A Empresa Brasileira de Pesquisa Agropecuária (Embrapa) desenvolveu uma tecnologia inovadora para recuperação de solos degradados na Amazônia e no Cerrado. O biofertilizante, produzido a partir de microrganismos nativos desses biomas, demonstrou em testes de campo aumentar em até 300% a produtividade de áreas recuperadas. A tecnologia também reduz em até 80% a necessidade de fertilizantes químicos, tornando-a mais sustentável e economicamente viável para pequenos produtores. A Embrapa prevê que a tecnologia estará disponível comercialmente a partir de 2025.',
        source: 'Embrapa',
        author: 'Centro Nacional de Pesquisa de Solos',
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Tecnologia',
        tags: ['solo', 'recuperação', 'biofertilizante', 'Embrapa'],
        externalUrl: 'https://www.embrapa.br/'
      },
      {
        id: '8',
        title: 'Governo federal anuncia investimento de R$ 2 bilhões em energias renováveis',
        summary: 'Programa nacional vai financiar projetos de energia solar, eólica e biomassa em regiões menos desenvolvidas do país.',
        content: 'O governo federal anunciou um investimento de R$ 2 bilhões em um programa nacional de incentivo às energias renováveis. O programa, chamado "Energia para Todos", vai financiar projetos de energia solar, eólica e biomassa em regiões menos desenvolvidas do país, especialmente no Nordeste e na Amazônia. A iniciativa prevê a instalação de mais de 500 MW de capacidade renovável nos próximos quatro anos, beneficiando cerca de 2 milhões de pessoas. O programa também inclui a capacitação de 10.000 profissionais para atuar no setor de energias renováveis.',
        source: 'Ministério de Minas e Energia',
        author: 'Secretaria de Energia Renovável',
        publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        imageUrl: '',
        category: 'Energia',
        tags: ['energia renovável', 'solar', 'eólica', 'biomassa'],
        externalUrl: 'https://www.gov.br/mme/pt-br'
      }
    ];

    return NextResponse.json(newsData);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}