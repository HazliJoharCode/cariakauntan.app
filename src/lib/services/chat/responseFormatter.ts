import { templates } from './responseTemplates';
import type { ChatContext } from './types';

export class ResponseFormatter {
  static format(type: string, data: any): string {
    switch (type) {
      case 'recommendations':
        return templates.recommendations(data);
      
      case 'clarification':
        return templates.clarification(data);
      
      case 'noMatch':
        return templates.noMatch(data);
      
      case 'welcome':
        return templates.welcome;
      
      case 'error':
        return templates.error;
      
      default:
        return templates.welcome;
    }
  }

  static formatServiceMatch(service: string, matches: any[]): string {
    if (matches.length === 0) {
      return templates.noMatch({ service });
    }

    return templates.recommendations(matches);
  }
}