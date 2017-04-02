import {fromJS} from 'immutable';
const exfbtemplates = [
  {
    'id': 'allposts',
    'name': 'All posts',
    'template': {
      'name': 'feed',
      'query': {
        'path': 'feed',
        'fields': 'caption,message,created_time,type,description,shares'
      }
    }

  },

  {
    'id': 'allcomments',
    'name': 'All comments',
    'template': {
      'name': 'comments',
      'query': {
        'path': 'feed',
        'fields': 'comments{message,created_time,from,comments{message,created_time,from}}'
      }
    }
  },

  {
    'id': 'alllikes',
    'name': 'All likes',
    'template': {
      'name': 'likes',
      'query': {
        'path': 'feed',
        'fields': 'likes{name,username},comments{likes{name,username},comments{likes{name,username}}}'
      }
    }
  },

  {
    'id': 'onlycommnetsposts',
    'name': 'Only comments of posts',
    'template': {
      'name': 'comments',
      'query': {
        'path': 'feed',
        'fields': 'comments{message,created_time,from}'
      }
    }
  },

  {
    'id': 'onlylikesposts',
    'name': 'Only likes of posts',
    'template': {
      'name': 'likes',
      'query': {
        'path': 'feed',
        'fields': 'likes{name,username}'
      }
    }
  },

  {
    'id': 'pageinsights',
    'name': 'Selected page insights for over last 1000 days',
    'template': {
      'name': 'page_insights',
      'query': {
        'path': '',
        'fields': 'insights.since(1000 days ago).metric(page_views_total, page_fan_removes, page_fan_adds, page_fans, page_negative_feedback, page_consumptions, page_engaged_users, page_impressions)'
      }
    }
  },

  {
    'id': 'postsinsights',
    'name': 'Selected posts insights',
    'template': {
      'name': 'posts_insights',
      'query': {
        'path': 'feed',
        'fields': 'insights.since(now).metric(post_negative_feedback, post_engaged_users, post_consumptions, post_impressions_fan, post_impressions_paid, post_impressions, page_posts_impressions_organic, page_posts_impressions_paid, page_posts_impressions)'
      }
    }
  },

  {
    'id': 'allpostslikessummary',
    'name': 'All posts LIKE reactions summary',
    'template': {
      'name': 'feed_likes',
      'query': {
        'path': 'feed',
        'fields': 'reactions.type(LIKE).summary(total_count).limit(0)'
      }
    }
  },

  {
    'id': 'allpostswowssummary',
    'name': 'All posts WOW reactions summary',
    'template': {
      'name': 'feed_wow',
      'query': {
        'path': 'feed',
        'fields': 'reactions.type(WOW).summary(total_count).limit(0)'
      }
    }
  },

  {
    'id': 'allpostshahasummary',
    'name': 'All posts HAHA reactions summary',
    'template': {
      'name': 'feed_haha',
      'query': {
        'path': 'feed',
        'fields': 'reactions.type(HAHA).summary(total_count).limit(0)'
      }
    }
  },

  {
    'id': 'allpostssadsummary',
    'name': 'All posts SAD reactions summary',
    'template': {
      'name': 'feed_sad',
      'query': {
        'path': 'feed',
        'fields': 'reactions.type(SAD).summary(total_count).limit(0)'
      }
    }
  },

  {
    'id': 'allpostsANGRYsummary',
    'name': 'All posts ANGRY reactions summary',
    'template': {
      'name': 'feed_angry',
      'query': {
        'path': 'feed',
        'fields': 'reactions.type(ANGRY).summary(total_count).limit(0)'
      }
    }
  },

  {
    'id': 'allpostslovesummary',
    'name': 'All posts LOVE reactions summary',
    'template': {
      'name': 'feed_love',
      'query': {
        'path': 'feed',
        'fields': 'reactions.type(LOVE).summary(total_count).limit(0)'
      }
    }
  }


];

const exfbAdsTemplates = [
  {
    'id': 'ads',
    'name': 'All Ads',
    'template': {
      'name': 'ads',
      'query': {
        'path': 'ads',
        'fields': 'id,name,adset_id'
      }
    }
  },

  {
    'id': 'campaigns',
    'name': 'All Campaigns',
    'template': {
      'name': 'campaigns',
      'query': {
        'path': 'campaigns',
        'fields': 'id,name,account_id'
      }
    }
  },
  {
    'id': 'adsinsights',
    'name': 'Ads Insights For Last Month',
    'template': {
      'name': 'ads_insights',
      'query': {
        'path': 'ads',
        'fields': 'insights.action_breakdowns(action_type).date_preset(last_month).time_increment(1){ad_id,impressions,reach,clicks,spend}'
      }
    }
  },
  {
    'id': 'adsinsightsactions',
    'name': 'Ads Insights Actions Stats For Last Month',
    'template': {
      'name': 'ads_insights',
      'query': {
        'path': 'ads',
        'fields': 'insights.action_breakdowns(action_type).date_preset(last_month).time_increment(1){ad_id,actions}'
      }
    }
  },

  {
    'id': 'adsets',
    'name': 'All Adsets',
    'template': {
      'name': 'adsets',
      'query': {
        'path': 'adsets',
        'fields': 'id,name,campaign_id'
      }
    }
  },

  {
    'id': 'campaigninsights',
    'name': 'Campaigns Detail - Q1 - Insights',
    'template': {
      'name': 'campaigns_insights',
      'query': {
        'path': 'campaigns',
        'fields': 'insights.date_preset(last_28_days).time_increment(1){account_id,account_name,campaign_id,campaign_name,impressions,clicks,spend,reach}'
      }
    }
  },

  {
    'id': 'campaigns_insights_type',
    'name': 'Campaigns Detail - Q1 - Action Types',
    'template': {
      'name': 'campaigns_insights_type',
      'query': {
        'path': 'campaigns',
        'fields': 'insights.action_breakdowns(action_type).date_preset(last_28_days).time_increment(1){account_id,account_name,campaign_id,campaign_name,actions}'
      }
    }
  },

  {
    'id': 'campaigns_insights_reaction',
    'name': 'Campaigns Detail - Q1 - Action Reactions',
    'template': {
      'name': 'campaigns_insights_reaction',
      'query': {
        'path': 'campaigns',
        'fields': 'insights.action_breakdowns(action_reaction).date_preset(last_28_days).time_increment(1){account_id,account_name,campaign_id,campaign_name,actions}'
      }
    }
  }


];

export default fromJS({
  'keboola.ex-facebook': exfbtemplates,
  'keboola.ex-facebook-ads': exfbAdsTemplates
});
