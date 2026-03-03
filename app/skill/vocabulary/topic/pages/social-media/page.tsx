import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_SOCIAL_MEDIA_WORDS } from '../../data/words/social-media';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('social-media');

export default function VocabularySocialMediaPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_SOCIAL_MEDIA_WORDS} />;
}
