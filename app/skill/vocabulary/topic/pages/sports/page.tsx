import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_SPORTS_WORDS } from '../../data/words/sports';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('sports');

export default function VocabularySportsPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_SPORTS_WORDS} />;
}
