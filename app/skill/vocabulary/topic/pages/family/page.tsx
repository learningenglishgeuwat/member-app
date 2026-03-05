import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_FAMILY_WORDS } from '../../data/words/family';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('family');

export default function VocabularyFamilyPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_FAMILY_WORDS} />;
}
