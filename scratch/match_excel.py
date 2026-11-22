import openpyxl
import json
import re

wb = openpyxl.load_workbook(r's:\sayim\GDG-web\GDG  (Responses).xlsx')
sheet = wb.active
excel_data = []
for r in list(sheet.iter_rows(values_only=True))[1:]:
    if r[1]:
        excel_data.append({
            'name': str(r[1]).strip(),
            'dept': r[2],
            'year': r[3],
            'github': str(r[4]).strip() if r[4] else '',
            'linkedin': str(r[5]).strip() if r[5] else '',
            'bio': str(r[7]).strip() if r[7] else '',
            'fun_fact': str(r[8]).strip() if r[8] else '',
            'motto': str(r[9]).strip() if r[9] else '',
            'skills': str(r[10]).strip() if r[10] else ''
        })

with open('src/data/team.json', 'r', encoding='utf-8') as f:
    team = json.load(f)

def clean_url(url, kind):
    if not url or url.lower() in ['none', 'n', 'no', 'na', 'null', '-']:
        return ''
    url = url.strip()
    url_match = re.search(r'https?://[^\s]+', url)
    if url_match:
        url = url_match.group(0)
    elif 'linkedin.com' in url or 'github.com' in url:
        if not url.startswith('http'):
            url = 'https://' + url.lstrip('/')
    else:
        if kind == 'github' and not url.startswith('http'):
            url = f'https://github.com/{url.lstrip("@")}'
        elif kind == 'linkedin' and not url.startswith('http'):
            url = f'https://www.linkedin.com/in/{url.lstrip("@")}'
    
    if 'linkedin.com' in url:
        url = url.split('?')[0].rstrip('/')
    if kind == 'github' and 'github.com/' in url:
        parts = url.split('github.com/')[-1].split('/')
        username = parts[0].replace('.git', '')
        url = f'https://github.com/{username}'
        
    return url

NAME_MAP = {
    'protyoy-bhandary': None,
    'sagnik-maitra': 'Sagnik Maitra',
    'sneha-patra': 'Sneha Patra',
    'sayim-mullick': 'Sayim Mullick',
    'raktik-ghosh': 'Raktik Ghosh',
    'aaryan-kumar': 'Aaryan Kumar',
    'narayan-kumar-jha': 'Narayan kumar Jha',
    'aadipto-ghosh': 'Aadipto Ghosh',
    'satarupa-sarkar': 'Satarupa Sarkar',
    'bikramjit-pakhira': 'Bikramjit Pakhira',
    'sayantan-pachal': 'Sayantan Pachal',
    'mouli-biswas': 'MOULI BISWAS',
    'subhajit-majee': 'Subhajit Majee',
    'larenza-roy': 'Larenza Roy',
    'saurabh-kumar-singh': 'Saurabh Kumar Singh',
    'alfia-ashraf': 'Alfia Ashraf',
    'sagnik-saha': 'Sagnik Saha',
    'soham-bandyopadhyay': 'Soham Banerjee',
    'sagnik-dutta': 'Sagnik Dutta',
    'sakchham-kapoor': 'SAKCHHAM KAPOOR',
    'shreyanka-satpathy': 'Shreyanka Satpathy'
}

updated_team = []
for m in team:
    mid = m['id']
    target_excel_name = NAME_MAP.get(mid)
    matched = None
    if target_excel_name:
        for e in excel_data:
            if e['name'].lower().strip() == target_excel_name.lower().strip():
                matched = e
                break
    
    if matched:
        gh = clean_url(matched['github'], 'github')
        li = clean_url(matched['linkedin'], 'linkedin')
        bio = matched['bio']
        fun_fact = matched['fun_fact']
        motto = matched['motto']
        skills = matched['skills']
        print(f"OK: {m['name']:20} -> GH: {gh:30} | LI: {li:35}")
        print(f"    BIO: {bio[:70]}...")
        m['socials']['github'] = gh
        if li:
            m['socials']['linkedin'] = li
        m['bio'] = bio
        m['funFact'] = fun_fact
        m['motto'] = motto
        m['skills'] = skills
    else:
        print(f"ORGANIZER (NO FORM): {m['name']}")
        if mid == 'protyoy-bhandary' and not m['bio']:
            m['bio'] = "GDG on Campus Organizer at B.P. Poddar Institute of Management and Technology. Passionate about community leadership, emerging technologies, and empowering students to build impactful software."
    updated_team.append(m)

with open('src/data/team.json', 'w', encoding='utf-8') as f:
    json.dump(updated_team, f, indent=2, ensure_ascii=False)

print("\nSuccessfully updated src/data/team.json!")
