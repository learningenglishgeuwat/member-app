import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_ENTERTAINMENT_MEDIA_WORDS } from '../../data/words/entertainment-media';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('entertainment-media');

export default function VocabularyEntertainmentMediaPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_ENTERTAINMENT_MEDIA_WORDS} />;
}
