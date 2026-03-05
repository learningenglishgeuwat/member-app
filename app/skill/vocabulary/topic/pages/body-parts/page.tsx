import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_BODY_PARTS_WORDS } from '../../data/words/body-parts';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('body-parts');

export default function VocabularyBodyPartsPage() {
  return (
    <VocabularyTopicDetailPage
      topic={topic}
      topicWords={VOCAB_TOPIC_BODY_PARTS_WORDS}
      showBodyPartIcon
    />
  );
}
