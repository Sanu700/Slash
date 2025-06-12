import { supabase } from '@/lib/supabase';

// FAQ types
export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  display_order: number;
}

// Page content types
export interface PageSection {
  title: string;
  content: string;
}

export interface PageContent {
  id: string;
  page_name: string;
  title: string;
  content: {
    sections: PageSection[];
  };
  meta_description?: string;
}

// FAQ functions
export const getFAQs = async (): Promise<{ [category: string]: FAQItem[] }> => {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching FAQs:', error);
    return {};
  }

  // Group by category
  return data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [category: string]: FAQItem[] });
};

// Helper function to ensure content is in the correct format
const formatPageContent = (data: any): PageContent => {
  let formattedContent;
  
  if (typeof data.content === 'string') {
    try {
      formattedContent = JSON.parse(data.content);
    } catch (e) {
      console.error('Error parsing JSON content:', e);
      formattedContent = { sections: [] };
    }
  } else if (typeof data.content === 'object' && data.content !== null) {
    formattedContent = data.content;
  } else {
    formattedContent = { sections: [] };
  }
  
  // Ensure the content has the expected structure
  if (!formattedContent.sections || !Array.isArray(formattedContent.sections)) {
    formattedContent = { sections: [] };
  }
  
  return {
    id: data.id,
    page_name: data.page_name,
    title: data.title,
    content: formattedContent as { sections: PageSection[] },
    meta_description: data.meta_description
  };
};

// Company page content functions
export const getCompanyPageContent = async (pageName: string): Promise<PageContent | null> => {
  const { data, error } = await supabase
    .from('company_pages')
    .select('*')
    .eq('page_name', pageName)
    .single();
  
  if (error) {
    console.error(`Error fetching ${pageName} content:`, error);
    return null;
  }
  
  return formatPageContent(data);
};

// Support page content functions
export const getSupportPageContent = async (pageName: string): Promise<PageContent | null> => {
  const { data, error } = await supabase
    .from('support_pages')
    .select('*')
    .eq('page_name', pageName)
    .single();
  
  if (error) {
    console.error(`Error fetching ${pageName} content:`, error);
    return null;
  }
  
  return formatPageContent(data);
};
