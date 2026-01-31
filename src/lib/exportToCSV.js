export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;

  // Define headers and map data
  const headers = ['ID', 'Nome', 'Telefone', 'Email', 'Data de Criação', 'Status', 'Último Contato', 'Serviço', 'Prioridade'];
  
  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      const row = [
        item.id,
        `"${item.name || ''}"`, // Wrap in quotes to handle commas in names
        item.phone || '',
        item.email || '',
        item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '',
        item.status || '',
        item.last_interaction_at ? new Date(item.last_interaction_at).toLocaleString('pt-BR') : '',
        `"${item.notes || ''}"`, // Using notes as service placeholder or actual service if available
        item.priority_score || 0
      ];
      return row.join(',');
    })
  ].join('\n');

  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  const finalFilename = filename.replace('[DATE]', dateStr);
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
